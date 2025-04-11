import express from 'express'
import { PPT } from './unit/ppt'
import { Vo } from './unit/vo'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
const app = express()
app.use(express.json())

const ppt = new PPT()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/ppt', async (req, res) => {
  const {
    outline,
    template = 'RootTemplate.pptx',
    catalogueSize = 4,
    topicSize = 4,
    argumentSize = 4,
    styleLength = 2, } = req.body

  const vo = new Vo<string>()

  try {
    const url = await ppt.create(outline,
      template,
      catalogueSize,
      topicSize,
      argumentSize,
      styleLength
    )
    vo.setCode('200')
    vo.setData(url)
  } catch (e) {
    console.log(e)
    vo.setCode('500')
  }
  res.send(vo)
})


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})