import { Chats, Content, Role } from '../core/llm.js'
import { chat2, printStream } from '../utils/functions.js'

const systemPrompt = `You are an intelligent agent designed to evaluate and categorize user requests based
on specific criteria. Your tasks are as follows:

1. **Evaluate Clarity:** Assess whether the user's prompt is clear and well-defined. If the prompt is ambiguous,
lacks necessary details, or requires further clarification, return the tag \`<needs-prompt-improvement>\`.

2. **Identify Execution Tasks:** Determine if the user's request involves executing tasks such as writing code to
a file, performing system operations, or any action that goes beyond text-based responses. If such tasks are present,
return the tag \`<needs-execution>\`.

For each user input, focus solely on these evaluations. Respond only with the appropriate tags without
additional commentary or responses.`

type Classification = {
  promptNeedsImprovement: boolean
  userRequestsExecution: boolean
}

export class UserMessageClassifier {
  public readonly chats: Chats

  constructor() {
    this.chats = []
    this.chats.push([Role.System, systemPrompt])
  }

  async prompt(message: Content): Promise<Classification> {
    this.chats.push([Role.User, message])
    const stream = await chat2(this.chats)
    if (stream !== undefined) {
      const finalOutput = await printStream(stream, false)
      return this.classify(finalOutput)
    }
    return {
      promptNeedsImprovement: false,
      userRequestsExecution: false,
    }
  }

  private classify(response: string): Classification {
    const classification: Classification = {
      promptNeedsImprovement: false,
      userRequestsExecution: false,
    }

    // Define regex patterns for tags (case insensitive)
    const needsPromptImprovementRegex = /<needs-prompt-improvement>/i
    const needsExecutionRegex = /<needs-execution>/i

    // Check for tags in the response
    classification.promptNeedsImprovement =
      needsPromptImprovementRegex.test(response)
    classification.userRequestsExecution = needsExecutionRegex.test(response)

    return classification
  }
}
