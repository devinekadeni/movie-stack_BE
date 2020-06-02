const app = require('./index')
const PORT = process.env.PORT || 3300

app.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`)
  console.log(`Apollo server run on http://localhost:${PORT}/graphql`)
})
