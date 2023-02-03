const app = require('./app')
require('dotenv').config()

const { PORT } = process.env

app.listen(PORT || 3030, () => {
  console.log("Server running. Use our API on port: 3000")
})