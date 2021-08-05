const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const v1 = require("./v1/index")
require("dotenv").config()
const db = require("./database/models")

const app = express()
// app.use(
//   cors({
//     origin: process.env.APP_FE_ORIGIN,
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
app.use("/v1", v1({ db }))

/// Start server
app.listen(port, () => {
  console.log(`Demo server listening at http://localhost:${port}`)
})
