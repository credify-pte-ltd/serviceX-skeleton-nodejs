const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const formKey = require("../utils/formKey")
const setupOidc = require("../handlers/setupOidc")
const userinfo = require("../handlers/userinfo")
const oidcCallback = require("../handlers/oidcCallback")
const checkExistence = require("../handlers/checkExistence")

const platform = "skeleton-node"
const mode = process.env.MODE || "development"
const signingKey = process.env.APP_SIGNING_KEY
const apiKey = process.env.APP_API_KEY
const organizationId = process.env.APP_ID
const redirectUrl = process.env.APP_REDIRECT_URL
const scopes = (process.env.APP_SCOPES || "openid,phone,profile").split(",")
const responseType = process.env.ODIC_RESPONSE_MODE || "form_post"
const responseMode = process.env.ODIC_RESPONSE_TYPE || "code"


module.exports = ({ db, externalDOPService }) => {
  const api = Router()
  const u = db.Users

  api.get("/oidc", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return setupOidc(req, res, {
      credify,
      db,
      platform,
      organizationId,
      redirectUrl,
      scopes,
      responseMode,
      responseType,
    })
  })

  // Handler for oidc implicit flow
  api.post("/oidc", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return userinfo(req, res, { db, credify })
  })

  // Handler for oidc code flow
  api.get("/oidc_callback", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return oidcCallback(req, res, { db, credify, organizationId, redirectUrl, externalDOPService })
  })

  api.post("/user-existence", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return checkExistence(req, res, { user: u, credify })
  })

  return api
}
