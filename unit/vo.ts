export class Vo<T> {
  private code: string = '200'
  private data: T | null = null
  private msg: string = ''

  setData(data: T) {
    this.data = data
  }

  setCode(code: string) {
    this.code = code
  }

  setMsg(msg: string) {
    this.msg = msg
  }
}