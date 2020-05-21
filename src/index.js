require('dotenv').config()
const express = require('express')
const initializeRoute = require('./routes')
const PORT = process.env.PORT || 3300

const app = express()

app.use(express.json())
initializeRoute(app)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(PORT, () => {
  console.log('Server run on port ' + PORT)
})
