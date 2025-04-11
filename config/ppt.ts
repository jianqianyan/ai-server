import { getRequireEnv } from "./config"

export class PPTConfig {
  /** 汇报人 */
  readonly presenterPre: string

  /** 封面页位置 */
  readonly coverI: string

  /** 目录页位置 */
  readonly catalogueI: string

  /** 封底页位置 */
  readonly backCoverI: string

  /** 目录总结也位置 */
  readonly summaryI: string

  /** 样式开始页 */
  readonly styleBegin: number

  /** 模板位置 */
  readonly templateDir: string

  constructor() {
    this.presenterPre = getRequireEnv('PRESENTERPRE')
    this.coverI = getRequireEnv('COVERI')
    this.catalogueI = getRequireEnv('CATALOGUEI')
    this.backCoverI = getRequireEnv('BACKCOVERI')
    this.summaryI = getRequireEnv('SUMMARYI')
    this.styleBegin = Number(getRequireEnv('STYLEBEGIN')) || 0
    this.templateDir = getRequireEnv('TEMPLATEDIR')
  }
}