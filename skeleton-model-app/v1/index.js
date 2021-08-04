const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const formKey = require("../utils/formKey")
const setupOidc = require("../handlers/setupOidc")
const userinfo = require("../handlers/userinfo")

const platform = "skeleton-node"
const mode = process.env.MODE || "development"
const signingKey = process.env.TIS_GIFT_SIGNING_KEY
const apiKey = process.env.TIS_GIFT_API_KEY
const organizationId = process.env.TIS_GIFT_ID
const redirectUrl = process.env.TIS_GIFT_REDIRECT_URL
const scopes = (process.env.TIS_GIFT_SCOPES || "openid,phone,profile").split(
  ","
)

module.exports = ({ db }) => {
  const api = Router()

  api.get("/oidc", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return setupOidc(req, res, {
      credify,
      db,
      platform,
      organizationId,
      redirectUrl,
      scopes,
    })
  })

  api.post("/oidc", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return userinfo(req, res, { db, credify })
  })

  return api
}
