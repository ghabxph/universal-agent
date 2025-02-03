// /* eslint-disable @typescript-eslint/no-explicit-any */

import readline from 'readline' // Import readline for user input
import { Chats, LLM, Role } from '../core/llm.js'
import dotenv from 'dotenv'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { execSync } from 'child_process'

// Only load dotenv if running in a Node.js environment
if (typeof process !== 'undefined' && process.env) {
  dotenv.config()
}

export async function printStream(
  stream: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>,
  showOutput: boolean = true,
): Promise<string> {
  const outputChunks: string[] = []
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await stream.read()
    if (done) break
    const chunk = decoder.decode(value.subarray(6), { stream: true }).trim()
    if (chunk !== undefined) {
      try {
        if (chunk !== 'ROUTER PROCESSING') {
          const json = JSON.parse(chunk)
          const content = json.choices[0].delta.content
          if (content != '') {
            outputChunks.push(content)
            if (showOutput) {
              process.stdout.write(content)
            }
          }
        }
      } catch {}
    }
  }
  console.log()
  return outputChunks.join('')
}

export async function chat(chats: Chats) {
  const llm = new LLM(
    process.env.API_URL as string,
    process.env.API_KEY as string,
    process.env.LLM_MODEL as string,
  )

  const lastChat = chats[chats.length - 1]
  const [role, content] = lastChat

  if (role === Role.System) {
    const [stream] = await llm.chat(chats)
    const finalMessage = await printStream(stream)
    chats.push([Role.Assistant, finalMessage])
    await chat(chats)
  } else if (role === Role.Assistant) {
    const systemCalls = extractSystemCalls(content)

    if (systemCalls.length === 0) {
      // No system calls detected → Allow user input
      const userMessage = await promptUser('User: ')
      chats.push([Role.User, userMessage])
      await chat(chats)
      return
    }

    const evalOutputs = systemCalls.map((systemCall) => runScript(systemCall))
    console.log()
    evalOutputs.map((out) => console.log(out))
    chats.push([Role.Tool, evalOutputs.join('')])
    await chat(chats)
  } else if (role === Role.Tool) {
    const [stream] = await llm.chat(chats)
    const finalMessage = await printStream(stream)
    chats.push([Role.Assistant, finalMessage])
    await chat(chats)
  } else if (role === Role.User) {
    const [stream] = await llm.chat(chats)
    const finalMessage = await printStream(stream)
    chats.push([Role.Assistant, finalMessage])
    await chat(chats)
  }
}

export async function chat2(chats: Chats) {
  const llm = new LLM(
    process.env.API_URL as string,
    process.env.API_KEY as string,
    process.env.LLM_MODEL as string,
  )

  const lastChat = chats[chats.length - 1]
  const [role, message] = lastChat

  console.log(`${role}: ${message}`)

  if ([Role.System, Role.Tool, Role.User].includes(role)) {
    const [stream] = await llm.chat(chats)
    return stream
  }
}

// Helper function for user input
function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function extractSystemCalls(input: string): string[] {
  const systemCalls: string[] = []
  let startIdx = 0

  while ((startIdx = input.indexOf('<SystemCall>', startIdx)) !== -1) {
    const endIdx = input.indexOf('</SystemCall>', startIdx)
    if (endIdx === -1) break // No closing tag found, stop processing

    // Extract content between <SystemCall> and </SystemCall>
    const command = input.substring(startIdx + 12, endIdx).trim()
    systemCalls.push(command)

    // Move startIdx forward to continue searching
    startIdx = endIdx + 13
  }

  return systemCalls
}

function runScript(scriptContent: string): string {
  const tmpDir = tmpdir()
  const randomFileName = `script-${Date.now()}-${Math.random().toString(36).substring(7)}.js`
  const scriptPath = join(tmpDir, randomFileName)
  let output: string = ''

  try {
    // Write the script to a temporary file
    writeFileSync(scriptPath, scriptContent, 'utf8')

    // Execute the script while preserving the current working directory
    output = execSync(`node "${scriptPath}"`, {
      cwd: process.cwd(),
      encoding: 'utf8',
    })
  } catch (error) {
    output = `${output}\nError:\n---------------------------\n${error}`
  } finally {
    // Cleanup: remove the temporary script file
    try {
      unlinkSync(scriptPath)
    } catch (unlinkError) {
      console.error('Failed to delete temp script:', unlinkError)
    }
  }

  return output
}
