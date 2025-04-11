import Automizer, { ModifyTextHelper } from "pptx-automizer/dist";
import { PPTConfig } from "../config/ppt";
import { Outline } from "../type/outline";
import { MinioService } from "./minio";

export class PPT {
  private automizer: Automizer
  private config: PPTConfig
  private minio: MinioService

  constructor() {
    this.config = new PPTConfig();
    this.automizer = new Automizer({
      templateDir: this.config.templateDir, // 模板文件夹路径
      removeExistingSlides: true, // 移除根模板中的现有幻灯片
    });
    this.minio = new MinioService()
  }

  /**
   * 
   * @param outline 大纲
   * @param template 模板
   * @param catalogueSize 目录数量 = 4
   * @param topicSize 论题数量 = 4
   * @param argumentSize 论点数量 = 4
   * @param styleLength 样式尺寸 = 2
   */
  create(outline: Outline, template: string, catalogueSize = 4, topicSize = 4, argumentSize = 4, styleLength = 2) : Promise<string> {
    let pres = this.automizer.loadRoot(template).load(template)

    // 封面制作
    pres.addSlide(template, this.config.coverI, (slide) => {
      slide.modifyElement('title', [ModifyTextHelper.setText(outline.title)])
      slide.modifyElement('subtitle', [
        ModifyTextHelper.setText(outline.subtitle),
      ])
      slide.modifyElement('presenter', [
        ModifyTextHelper.setText(this.config.presenterPre + outline.presenter),
      ])
    })

    // 目录制作
    pres.addSlide(template, this.config.catalogueI, (slide) => {
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
      pres.addSlide(template, this.config.summaryI, (slide) => {
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
        pres.addSlide(template, stylei + this.config.styleBegin, (slide) => {
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
    pres.addSlide(template, this.config.backCoverI)

    // 生成输出文件
    return new Promise((resolve) => {
      pres.getJSZip().then((jsZip) => {
        jsZip.generateAsync({ type: 'arraybuffer' }).then((arrayBuffer) => {
          let url = this.minio.save(arrayBuffer, 'pptx')
          resolve(url)
        })
      })
    })
  }
}