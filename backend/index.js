const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const todo = require('./routes/todo')
const dotenv = require('dotenv')
dotenv.config()


const mongoDBUrl = process.env.mongoDBUrl || 'mongodb://localhost:27017'
const PORT = process.env.SERVER_PORT || 8000

mongoose
  .connect(`${mongoDBUrl}/todo`)
  .then((e) =>
    console.log(
      `connected to db on:${e.connection.host}/${e.connection.port}/todo`
    )
  )
  .catch((e) => console.log(e.message))

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/', todo)

app.listen(PORT, () => {
  console.log(`listening on port:${PORT}`)
})
