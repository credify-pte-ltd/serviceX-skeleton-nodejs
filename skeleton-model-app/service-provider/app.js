const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()
const v1 = require("./v1/index")
const db = require("./database/models")

// Setup DI container
const { createContainer } = require('awilix')
const container = createContainer()
container.loadModules([['external/**/*.js', { injector: () => ({ timeout: 2000 }) }]])


// Load DOP Service
const externalDOPService = container.resolve('externalDOPService')
const dependencies = {
  db,
  externalDOPService
}

const app = express()
// app.use(
//   cors({
//     origin: process.env.TIS_FE_ORIGIN,
//   })
// )
app.use(morgan("combined"))
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

const port = process.env.PORT || 8000
app.get("/", (req, res) => {
  res.send("health check")
})
app.get("/favicon.ico", (req, res) => res.status(204))
app.use("/v1", v1(dependencies))

/// Start server
app.listen(port, () => {
  console.log(`Demo server listening at http://localhost:${port}`)
})
