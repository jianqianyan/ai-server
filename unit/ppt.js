import { ModifyTextHelper, Automizer } from 'pptx-automizer'
import {
  backCoverI,
  catalogueI,
  coverI,
  presenterPre,
  styleBegin,
  summaryI,
} from '../config/ppt.js'

const templateDir = './templates'
import { MinioServer } from './minio.js'

export class PPT {
  automizer
  minio

  constructor() {
    this.automizer = new Automizer({
      templateDir: templateDir, // 模板文件目录
      removeExistingSlides: true, // 移除根模板中的现有幻灯片
    })
    this.minio = new MinioServer()
  }

  /**
   *
   * @param {*} outline 大纲
   * @param {*} template 模板
   * @param {*} catalogueSize 目录数量
   * @param {*} topicSize 论题数量
   * @param {*} argumentSize 论点数量
   * @param {*} styleLength 样式尺寸
   */
  create(
    outline,
    template,
    catalogueSize,
    topicSize,
    argumentSize,
    styleLength
  ) {
    let pres = this.automizer.loadRoot(template).load(template)

    // 封面制作
    pres.addSlide(template, coverI, (slide) => {
      slide.modifyElement('title', [ModifyTextHelper.setText(outline.title)])
      slide.modifyElement('subtitle', [
        ModifyTextHelper.setText(outline.subtitle),
      ])
      slide.modifyElement('presenter', [
        ModifyTextHelper.setText(presenterPre + outline.presenter),
      ])
    })

    // 目录制作
    pres.addSlide(template, catalogueI, (slide) => {
      for (let i = 0; i < catalogueSize; ++i) {
        slide.modifyElement('catalogue' + (i + 1), [
          ModifyTextHelper.setText(outline.outline[i].title),
        ])
      }
    })

    // 每个模块制作
    let stylei = 0
    for (let page = 0; page < catalogueSize; ++page) {
      // 制作总结页
      pres.addSlide(template, summaryI, (slide) => {
        slide.modifyElement('index', [ModifyTextHelper.setText(page + 1)])
        slide.modifyElement('title', [
          ModifyTextHelper.setText(outline.outline[page].title),
        ])
        slide.modifyElement('describe', [
          ModifyTextHelper.setText(outline.outline[page].describe),
        ])
      })

      for (let topic = 0; topic < topicSize; ++topic) {
        if (stylei === styleLength) {
          stylei = 0
        }
        pres.addSlide(template, stylei + styleBegin, (slide) => {
          slide.modifyElement('page_title', [
            ModifyTextHelper.setText(
              outline.outline[page].content[topic].title
            ),
          ])
          for (let argument = 0; argument < argumentSize; ++argument) {
            slide.modifyElement('title' + (argument + 1), [
              ModifyTextHelper.setText(
                outline.outline[page].content[topic].content[argument].title
              ),
            ])
            slide.modifyElement('content' + (argument + 1), [
              ModifyTextHelper.setText(
                outline.outline[page].content[topic].content[argument].content
              ),
            ])
          }
        })
        stylei++
      }
    }

    // 封底制作
    pres.addSlide(template, backCoverI)

    // 生成输出文件
    return new Promise((resolve) => {
      pres.getJSZip().then((jsZip) => {
        jsZip.generateAsync({ type: 'arraybuffer' }).then((arrayBuffer) => {
          let url = this.minio.savePpt(arrayBuffer)
          resolve(url)
        })
      })
    })
  }
}
