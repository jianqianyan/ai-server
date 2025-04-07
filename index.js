import express from 'express'
import { PPT } from './unit/ppt.js'

const app = express()

app.use(express.json())

const ppt = new PPT()

app.post('/ppt', async (req, res) => {
  const {
    outline,
    template = 'RootTemplate.pptx',
    catalogueSize = 4,
    topicSize = 4,
    argumentSize = 4,
    styleLength = 2,
  } = req.body
  const url = await ppt.create(
    outline,
    template,
    catalogueSize,
    topicSize,
    argumentSize,
    styleLength
  )
  res.send(url)
})

app.listen(3000, () => {
  console.log('服务已运行在3000')
})
