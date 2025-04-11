import { Manufacturer } from "..";
import { AIConfig } from "../../config/manufacturer/siliconflow";

export class Siliconflow implements Manufacturer {
  modelName: string;

  public onmessage = (str: string) => { };

  public onend = () => { };

  config: AIConfig

  constructor(model: string) {
    this.modelName = model;
    this.config = new AIConfig()
  }

  chat(messages: string) {
    fetch(this.config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.key}`,
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: messages,
        stream: true,
        max_tokens: 512,
        stop: null,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
      })
    }).then((res) => {
      if (!res.body) {
        return this.onend()
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      const readStream = () => {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              buffer = processBuffer(buffer)
              this.onend()
              return
            }
            buffer += decoder.decode(value)
            buffer = processBuffer(buffer)
            readStream()
          })
          .catch((err) => {
            console.error('Error reading stream:', err)
          })
      }
      const processBuffer = (buffer: string) => {
        const lines = buffer.split('\n')
        let remaining = ''
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line.startsWith('data:')) {
            const jsonStr = line.slice(5).trim()
            if (jsonStr === '[DONE]') {
              this.onend()
            } else if (jsonStr) {
              try {
                const json = JSON.parse(jsonStr)
                const content =
                  json.choices[0].delta.content ||
                  json.choices[0].delta.reasoning_content
                if (typeof content === 'string') {
                  this.onmessage(content)
                }
              } catch (parseError) {
                console.error('JSON parse error:', parseError)
                remaining += line + '\n'
              }
            }
          } else {
            remaining += line + '\n'
          }
        }
        return remaining
      }
      readStream()
    })
  }
}