const express = require('express')
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const cors = require('cors')
const fs = require('fs')
const { v1: uuidv1 } = require('uuid')
const expressValidator = require('express-validator');
const app = express()

dotenv.config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err.message))

const PORT = process.env.PORT || 8080
app.use(expressValidator())
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/', postRoutes)
app.use('/', authRoutes)
app.use('/', userRoutes)
app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) =>  {
    if (err) {
      res.status(400).json({
        error: err
      })
    }
    const docs = JSON.parse(data)
    res.json(docs)
  })
})
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: 'Unauthorized!'})
  }
})

app.listen(PORT, () => console.log(`A Node js API is listening on port: ${PORT}`))