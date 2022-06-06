const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const formKey = require("../utils/formKey")

const evaluate = require("../handlers/evaluateOffer")
const filterOffer = require("../handlers/filterOffer")
const countUsers = require("../handlers/countUsers")
const encryptClaims = require("../handlers/encryptClaims")
const pushClaims = require("../handlers/pushClaims")
const faker = require("faker")
const {DEFAULT_PATH} = require("../utils/constants");

const mode = process.env.MODE || "development"
const signingKey = process.env.APP_SIGNING_KEY
const apiKey = process.env.APP_API_KEY

module.exports = ({ db }) => {
  const api = Router()

  // Not required
  api.get("/demo-user", async (req, res) => {
    try {
      const presetId = req.query.id
      const id = presetId || faker.datatype.number(10000)
      const user = await db.Users.findByPk(id)
      // const user = await db.Users.findAll();
      res.json(user)
    } catch (e) {
      res.json({ error: { message: e.message } })
    }
  })

  api.post(DEFAULT_PATH.PUSH_CLAIMS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return pushClaims(req, res, { db, credify })
  })

  api.post(DEFAULT_PATH.OFFERS_FILTERING, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return filterOffer(req, res, { db, credify })
  })

  api.post(DEFAULT_PATH.USER_COUNTS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return countUsers(req, res, { db, credify })
  })

  api.post(DEFAULT_PATH.OFFER_EVALUATION, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return evaluate(req, res, { db, credify })
  })

  api.post(DEFAULT_PATH.ENCRYPTED_CLAIMS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return encryptClaims(req, res, { db, credify });
  })

  api.post("/webhook", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return encryptClaims(req, res, { db, credify });
  })


  return api
}
