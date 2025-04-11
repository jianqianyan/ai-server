import { getRequireEnv } from "../config"

export class AIConfig {
  readonly key: string
  readonly url: string

  constructor() {
    this.key = getRequireEnv('SILICONFLOW_KEY')
    this.url = getRequireEnv('SILICONFLOW_URL')
  }
}