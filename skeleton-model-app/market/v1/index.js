const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const formKey = require("../utils/formKey")

const evaluate = require("../handlers/evaluateOffer")
const filterOffer = require("../handlers/filterOffer")
const countUsers = require("../handlers/countUsers")
const encryptClaims = require("../handlers/encryptClaims")
const {
  personalizeOffers,
  evaluateOffer,
  scopeNames,
  composeClaimObject,
} = require("./scopes")

const mode = process.env.MODE || "development"
const signingKey = process.env.APP_SIGNING_KEY
const apiKey = process.env.APP_API_KEY
const organizationId = process.env.APP_ID

module.exports = ({ db }) => {
  const api = Router()

  api.get("/demo-user", async (req, res) => {
    try {
      const presetId = req.query.id
      const id = presetId || faker.datatype.number(10000)
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
