import express from 'express'
import { urlencoded } from 'body-parser'
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.listen(process.env.PORT || 8080)

app.post('/notify', async (req, res) => {
    const { asset, amount, } = await req.body
})