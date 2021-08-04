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

  api.get("/demo-user", async (req, res) => {
    try {
      const presetId = req.query.id
      const id = presetId || faker.random.number(10000)
      const user = await u.findByPk(id)
      res.json(user)
    } catch (e) {
      res.json({ error: { message: e.message } })
    }
  })

  api.post("/create", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return create(req, res, {
      user: u,
      credify,
      composeClaimObject,
      organizationId,
    })
  })

  api.post("/push-claims", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return pushClaims(req, res, {
      user: u,
      commitment: c,
      credify,
      composeClaimObject,
      organizationId,
    })
  })

  api.post("/offers-filtering", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return filterOffer(req, res, { user: u, credify, personalizeOffers })
  })

  api.post("/user-counts", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return countUsers(req, res, { user: u, credify, evaluateOffer, scopeNames })
  })

  api.post("/offer-evaluation", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return evaluate(req, res, { evaluateOffer, credify, user: u })
  })

  api.post("/encrypted-claims", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return encryptClaims(req, res, {
      user: u,
      commitment: c,
      credify,
      composeClaimObject,
    })
  })

  return api
}
