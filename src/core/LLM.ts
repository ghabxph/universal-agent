/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Role {
  System = 'system',
  Tool = 'tool',
  Assistant = 'assistant',
  User = 'user',
}

export type Content = string

export type Chats = Array<[Role, Content]>

export class LLM {
  constructor(
    public url: string,
    private apiKey?: string,
    private model?: string,
  ) {}

  async models() {
    const response = await fetch(`${this.url}/v1/models`, {
      headers: this.authHeaders(),
    })
    return response.json()
  }

  async chat(
    chats: Chats,
  ): Promise<[ReadableStreamDefaultReader<Uint8Array>, Chats]> {
    type Message = { role: Role; content: string }
    type Payload = { messages: Message[] }

    let payload: Payload = {
      messages: chats.map(([role, content]) => ({ role, content })),
    }

    const model = this.model

    const response = await fetch(`${this.url}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, ...payload, stream: true }),
    })

    if (!response.body) throw new Error('Response body is empty')

    return [response.body.getReader(), chats]
  }

  async completions(payload: Record<string, any>) {
    return this.post(`${this.url}/v1/completions`, payload)
  }

  async embeddings(payload: Record<string, any>) {
    return this.post(`${this.url}/v1/embeddings`, payload)
  }

  private async post(endpoint: string, payload: Record<string, any>) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    return response.json()
  }

  private authHeaders(): Record<string, string> {
    return this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}
  }
}
