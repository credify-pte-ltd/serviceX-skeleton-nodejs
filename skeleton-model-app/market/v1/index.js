const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const formKey = require("../utils/formKey")

const evaluate = require("../handlers/evaluateOffer")
const filterOffer = require("../handlers/filterOffer")
const countUsers = require("../handlers/countUsers")
const encryptClaims = require("../handlers/encryptClaims")
const pushClaims = require("../handlers/pushClaims")
const webhook = require("../handlers/webhook")
const bnplCallback = require("../handlers/bnplCallback")
const createOrder = require("../handlers/createOrder")
const getOrders = require("../handlers/getOrders")
const cancelOrder = require("../handlers/cancelOrder")
const disburse = require("../handlers/disburse")
const faker = require("faker")
const {DEFAULT_PATH} = require("../utils/constants");

const mode = process.env.MODE || "development"
const signingKey = process.env.APP_SIGNING_KEY
const apiKey = process.env.APP_API_KEY

module.exports = ({ db }) => {
  const api = Router()

  // Not required. This is for the debugging purpose.
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

  // Called by Credify frontend SDK
  api.post(DEFAULT_PATH.PUSH_CLAIMS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return pushClaims(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.OFFERS_FILTERING, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return filterOffer(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.USER_COUNTS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return countUsers(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.OFFER_EVALUATION, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return evaluate(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.ENCRYPTED_CLAIMS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return encryptClaims(req, res, { db, credify })
  })

  // Called by Service Provider frontend
  api.get(DEFAULT_PATH.BNPL_COMPLETION_CALLBACK, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return bnplCallback(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.WEBHOOK, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return webhook(req, res, { db, credify })
  })

  // Called by your system for BNPL
  api.post("/orders", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return createOrder(req, res, { db, credify })
  })

  // Called by your system for BNPL
  api.get("/orders/credify/:id", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return getOrders(req, res, { db, credify })
  })

  // Called by your system for BNPL
  api.post("/orders/:id/cancel", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return cancelOrder(req, res, { db, credify })
  })

  // Called by your system for BNPL
  api.post("/orders/:id/disburse", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return disburse(req, res, { db, credify })
  })


  return api
}
