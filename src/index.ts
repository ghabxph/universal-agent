import { ChatbotAgent } from './agents/chatbot.js'

const console = new ChatbotAgent()

// console.prompt(
//   `Please write me a system prompt. I will call this Agent: \`debugger\`. The job of this agent is to troubleshoot
//   errors that we caught from code execution. It will autonomously solve error found during code execution. The tool
//   will return the full code that shows an error, enclosed with <code></code> tags. The job of debugger is to alter
//   the code by wrapping it in a <solution></solution> tag. The agent will talk to the system via \`tool\` role back
//   and forth until it resolve the error. Once the issue is solved, the agent will no longer return <solution></solution>
//   tag and the control will be passed back to user for user to decide whether to continue with the automation or not.`,
// )

console.prompt(
  `I want you to write me a simple TODO app in react. Make it beautiful!`,
)
