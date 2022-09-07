const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const formKey = require("../utils/formKey")

const evaluate = require("../handlers/evaluateOffer")
const filterOffer = require("../handlers/filterOffer")
const countUsers = require("../handlers/countUsers")
const encryptClaims = require("../handlers/encryptClaims")
const pushClaims = require("../handlers/pushClaims")
const pushDisbursementClaims = require("../handlers/pushDisbursementClaims")
const getBNPLDisbursementDocs = require("../handlers/getBNPLDisbursementDocs")
const webhook = require("../handlers/webhook")
const bnplCallback = require("../handlers/bnplCallback")
const createOrder = require("../handlers/createOrder")
const getOrders = require("../handlers/getOrders")
const cancelOrder = require("../handlers/cancelOrder")
const disburse = require("../handlers/disburse")
const faker = require("faker")
const { DEFAULT_PATH } = require("../utils/constants");

const mode = process.env.MODE || "development"
const signingKey = process.env.APP_SIGNING_KEY
const apiKey = process.env.APP_API_KEY

module.exports = ({ db }) => {
  const api = Router()

  let credify = null;

  // Not required. This is for the debugging purpose.
  api.get("/demo-user", async (req, res) => {
    try {
      const presetId = req.query.id
      const id = presetId || faker.datatype.number(5000)
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

  // Deprecated. Called by Service Provider frontend
  api.get(DEFAULT_PATH.OLD_BNPL_COMPLETION_CALLBACK, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return bnplCallback(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.WEBHOOK, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return webhook(req, res, { db, credify })
  })

  // Called by Credify backend
  api.post(DEFAULT_PATH.GET_BNPL_DISBURSEMENT_DOCS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return getBNPLDisbursementDocs(req, res, { db, credify })
  })

  // Called by your system for BNPL
  // This is necessary to start BNPL
  api.post("/orders", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return createOrder(req, res, { db, credify })
  })

  // Called by your system for BNPL
  // This is optional
  api.get("/orders/credify/:id", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return getOrders(req, res, { db, credify })
  })

  // Called by your system for BNPL
  // This is necessary if you want to cancel the BNPL order
  api.post("/orders/:id/cancel", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return cancelOrder(req, res, { db, credify })
  })

  // Called by your system for BNPL
  // This is handled by webhook handler by default, so you don't have to explicitly call this
  api.post("/orders/:id/disburse", async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return disburse(req, res, { db, credify })
  })

  // Called by your system for BNPL
  // This is necessary to request disbursement
  api.post(DEFAULT_PATH.PUSH_BNPL_DISBURSEMENT_CLAIMS, async (req, res) => {
    const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
    return pushDisbursementClaims(req, res, { db, credify })
  })


  // Not required. This is for the demo purpose.
  api.get("/orders", async (req, res) => {
    const orders = await db.Order.findAll()
    res.status(200).json({ orders: orders })
  })

  api.get("/simulation", async (req, res) => {
    res.status(200).json({
      success: true, data: [
        {
          "schema": "schema-1",
          "provider": {
            "id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
            "name": "Housecare",
            "description": "LetMeCare – LetMeCare JSC",
            "logo_url": "https://i.imgur.com/hkfv1AB.jpg",
            "app_url": "https://www.letmecare.vn/",
            "categories": [],
            "scope_definitions": [
              {
                "id": "63a47ef0-76b1-11eb-9439-0242ac130002",
                "provider_id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
                "name": "8af0e885-a06c-4508-8d17-03e4fa1ea526:payment-amount",
                "display_name": "Payment amount",
                "description": "Payment amount",
                "price": {
                  "value": "2.00",
                  "currency": "VND"
                },
                "is_onetime_charge": false,
                "is_active": true,
                "claims": [
                  {
                    "id": "63a489e0-76b1-11eb-9439-0242ac130002",
                    "scope_id": "63a47ef0-76b1-11eb-9439-0242ac130002",
                    "main_claim_id": "",
                    "name": "52f5969d-d51a-4616-80be-43b9f5aff548:payment-amount",
                    "display_name": "Payment amount",
                    "description": "Payment amount",
                    "value_type": "INTEGER",
                    "min_value": 0,
                    "max_value": 500000000,
                    "is_active": true,
                    "created_at": "2021-01-20T02:36:58.238194Z",
                    "updated_at": "2021-01-20T02:36:58.238194Z",
                    "nested": [],
                    "main": null,
                    "scope": null
                  }
                ],
                "created_at": "2021-01-20T02:36:58.236308Z",
                "updated_at": "2021-01-20T02:36:58.236308Z",
                "provider": null
              },
              {
                "id": "487075aa-76af-11eb-9439-0242ac130002",
                "provider_id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
                "name": "8af0e885-a06c-4508-8d17-03e4fa1ea526:housecare-score",
                "display_name": "House care score",
                "description": "House care score",
                "price": {
                  "value": "1.00",
                  "currency": "VND"
                },
                "is_onetime_charge": false,
                "is_active": true,
                "claims": [
                  {
                    "id": "63a48ac6-76b1-11eb-9439-0242ac130002",
                    "scope_id": "487075aa-76af-11eb-9439-0242ac130002",
                    "main_claim_id": "",
                    "name": "52f5969d-d51a-4616-80be-43b9f5aff548:housecare-score",
                    "display_name": "House care score",
                    "description": "House care score",
                    "value_type": "INTEGER",
                    "min_value": 0,
                    "max_value": 500,
                    "is_active": true,
                    "created_at": "2021-01-20T02:36:58.238194Z",
                    "updated_at": "2021-01-20T02:36:58.238194Z",
                    "nested": [],
                    "main": null,
                    "scope": null
                  }
                ],
                "created_at": "2021-01-20T02:36:58.236308Z",
                "updated_at": "2021-01-20T02:36:58.236308Z",
                "provider": null
              }
            ],
            "placement_fee": null,
            "shareable_basic_profile": [
              "NAME",
              "EMAIL",
              "PHONE"
            ]
          },
          "product": {
            "code": "product-1",
            "product_type_code": "insurance:health-insurance:for-individual",
            "display_name": "Bảo hiểm tai nạn",
            "description": "",
            "created_at": "2021-12-21T13:46:58.307492Z",
            "updated_at": "2021-12-21T13:46:58.307492Z",
            "detail": null,
            "conversion_commissions": [
              {
                "name": "hdi-tai-nan-1-agency-fee",
                "display_name": "Bảo hiểm tai nạn - Agency Fee",
                "includes_vat": false,
                "rate": 20,
                "fixed_value": null
              },
              {
                "name": "hdi-tai-nan-2-bonus-agency-support",
                "display_name": "Bảo hiểm tai nạn - Bonus Agency Support",
                "includes_vat": false,
                "rate": 20,
                "fixed_value": null
              },
              {
                "name": "hdi-tai-nan-3-service-fee",
                "display_name": "Bảo hiểm tai nạn - Service Fee",
                "includes_vat": false,
                "rate": 10,
                "fixed_value": null
              }
            ],
            "id": "262ef210-d2c6-4621-8393-fd55c1e24f4c",
            "consumer_id": "cc61532e-4668-4bee-b8c1-95fd0bec7f09",
            "custom_scopes": [],
            "consumer": null,
            "website_url": "",
            "thumbnail_url": "",
            "banner_url": "",
            "term_of_use_url": "",
            "required_claims": null,
            "custom_fields": {}
          },
          "tenor": {
            "value": 3,
            "unit": "MONTH"
          },
          "total_amount": {
            "value": "10000000",
            "currency": "VND"
          },
          "transaction_amount": {
            "value": "9000000",
            "currency": "VND"
          },
          "period_amount": {
            "value": "1000000",
            "currency": "VND"
          },
          "down_payment": {
            "value": "1000000",
            "currency": "VND"
          }
        },
        {
          "schema": "schema-1",
          "provider": {
            "id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
            "name": "Housecare",
            "description": "LetMeCare – LetMeCare JSC",
            "logo_url": "https://i.imgur.com/hkfv1AB.jpg",
            "app_url": "https://www.letmecare.vn/",
            "categories": [],
            "scope_definitions": [
              {
                "id": "63a47ef0-76b1-11eb-9439-0242ac130002",
                "provider_id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
                "name": "8af0e885-a06c-4508-8d17-03e4fa1ea526:payment-amount",
                "display_name": "Payment amount",
                "description": "Payment amount",
                "price": {
                  "value": "2.00",
                  "currency": "VND"
                },
                "is_onetime_charge": false,
                "is_active": true,
                "claims": [
                  {
                    "id": "63a489e0-76b1-11eb-9439-0242ac130002",
                    "scope_id": "63a47ef0-76b1-11eb-9439-0242ac130002",
                    "main_claim_id": "",
                    "name": "52f5969d-d51a-4616-80be-43b9f5aff548:payment-amount",
                    "display_name": "Payment amount",
                    "description": "Payment amount",
                    "value_type": "INTEGER",
                    "min_value": 0,
                    "max_value": 500000000,
                    "is_active": true,
                    "created_at": "2021-01-20T02:36:58.238194Z",
                    "updated_at": "2021-01-20T02:36:58.238194Z",
                    "nested": [],
                    "main": null,
                    "scope": null
                  }
                ],
                "created_at": "2021-01-20T02:36:58.236308Z",
                "updated_at": "2021-01-20T02:36:58.236308Z",
                "provider": null
              },
              {
                "id": "487075aa-76af-11eb-9439-0242ac130002",
                "provider_id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
                "name": "8af0e885-a06c-4508-8d17-03e4fa1ea526:housecare-score",
                "display_name": "House care score",
                "description": "House care score",
                "price": {
                  "value": "1.00",
                  "currency": "VND"
                },
                "is_onetime_charge": false,
                "is_active": true,
                "claims": [
                  {
                    "id": "63a48ac6-76b1-11eb-9439-0242ac130002",
                    "scope_id": "487075aa-76af-11eb-9439-0242ac130002",
                    "main_claim_id": "",
                    "name": "52f5969d-d51a-4616-80be-43b9f5aff548:housecare-score",
                    "display_name": "House care score",
                    "description": "House care score",
                    "value_type": "INTEGER",
                    "min_value": 0,
                    "max_value": 500,
                    "is_active": true,
                    "created_at": "2021-01-20T02:36:58.238194Z",
                    "updated_at": "2021-01-20T02:36:58.238194Z",
                    "nested": [],
                    "main": null,
                    "scope": null
                  }
                ],
                "created_at": "2021-01-20T02:36:58.236308Z",
                "updated_at": "2021-01-20T02:36:58.236308Z",
                "provider": null
              }
            ],
            "placement_fee": null,
            "shareable_basic_profile": [
              "NAME",
              "EMAIL",
              "PHONE"
            ]
          },
          "product": {
            "code": "product-1",
            "product_type_code": "insurance:health-insurance:for-individual",
            "display_name": "Bảo hiểm tai nạn",
            "description": "",
            "created_at": "2021-12-21T13:46:58.307492Z",
            "updated_at": "2021-12-21T13:46:58.307492Z",
            "detail": null,
            "conversion_commissions": [
              {
                "name": "hdi-tai-nan-1-agency-fee",
                "display_name": "Bảo hiểm tai nạn - Agency Fee",
                "includes_vat": false,
                "rate": 20,
                "fixed_value": null
              },
              {
                "name": "hdi-tai-nan-2-bonus-agency-support",
                "display_name": "Bảo hiểm tai nạn - Bonus Agency Support",
                "includes_vat": false,
                "rate": 20,
                "fixed_value": null
              },
              {
                "name": "hdi-tai-nan-3-service-fee",
                "display_name": "Bảo hiểm tai nạn - Service Fee",
                "includes_vat": false,
                "rate": 10,
                "fixed_value": null
              }
            ],
            "id": "262ef210-d2c6-4621-8393-fd55c1e24f4c",
            "consumer_id": "cc61532e-4668-4bee-b8c1-95fd0bec7f09",
            "custom_scopes": [],
            "consumer": null,
            "website_url": "",
            "thumbnail_url": "",
            "banner_url": "",
            "term_of_use_url": "",
            "required_claims": null,
            "custom_fields": {}
          },
          "tenor": {
            "value": 6,
            "unit": "MONTH"
          },
          "total_amount": {
            "value": "10000000",
            "currency": "VND"
          },
          "transaction_amount": {
            "value": "9000000",
            "currency": "VND"
          },
          "period_amount": {
            "value": "1000000",
            "currency": "VND"
          },
          "down_payment": {
            "value": "1000000",
            "currency": "VND"
          }
        },
        {
          "schema": "schema-1",
          "provider": {
            "id": "8af0e885-a06c-4508-8d17-03e4fa1ea333",
            "name": "Housecare",
            "description": "LetMeCare – LetMeCare JSC",
            "logo_url": "https://i.imgur.com/hkfv1AB.jpg",
            "app_url": "https://www.letmecare.vn/",
            "categories": [],
            "scope_definitions": [
              {
                "id": "63a47ef0-76b1-11eb-9439-0242ac130002",
                "provider_id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
                "name": "8af0e885-a06c-4508-8d17-03e4fa1ea526:payment-amount",
                "display_name": "Payment amount",
                "description": "Payment amount",
                "price": {
                  "value": "2.00",
                  "currency": "VND"
                },
                "is_onetime_charge": false,
                "is_active": true,
                "claims": [
                  {
                    "id": "63a489e0-76b1-11eb-9439-0242ac130002",
                    "scope_id": "63a47ef0-76b1-11eb-9439-0242ac130002",
                    "main_claim_id": "",
                    "name": "52f5969d-d51a-4616-80be-43b9f5aff548:payment-amount",
                    "display_name": "Payment amount",
                    "description": "Payment amount",
                    "value_type": "INTEGER",
                    "min_value": 0,
                    "max_value": 500000000,
                    "is_active": true,
                    "created_at": "2021-01-20T02:36:58.238194Z",
                    "updated_at": "2021-01-20T02:36:58.238194Z",
                    "nested": [],
                    "main": null,
                    "scope": null
                  }
                ],
                "created_at": "2021-01-20T02:36:58.236308Z",
                "updated_at": "2021-01-20T02:36:58.236308Z",
                "provider": null
              },
              {
                "id": "487075aa-76af-11eb-9439-0242ac130002",
                "provider_id": "8af0e885-a06c-4508-8d17-03e4fa1ea526",
                "name": "8af0e885-a06c-4508-8d17-03e4fa1ea526:housecare-score",
                "display_name": "House care score",
                "description": "House care score",
                "price": {
                  "value": "1.00",
                  "currency": "VND"
                },
                "is_onetime_charge": false,
                "is_active": true,
                "claims": [
                  {
                    "id": "63a48ac6-76b1-11eb-9439-0242ac130002",
                    "scope_id": "487075aa-76af-11eb-9439-0242ac130002",
                    "main_claim_id": "",
                    "name": "52f5969d-d51a-4616-80be-43b9f5aff548:housecare-score",
                    "display_name": "House care score",
                    "description": "House care score",
                    "value_type": "INTEGER",
                    "min_value": 0,
                    "max_value": 500,
                    "is_active": true,
                    "created_at": "2021-01-20T02:36:58.238194Z",
                    "updated_at": "2021-01-20T02:36:58.238194Z",
                    "nested": [],
                    "main": null,
                    "scope": null
                  }
                ],
                "created_at": "2021-01-20T02:36:58.236308Z",
                "updated_at": "2021-01-20T02:36:58.236308Z",
                "provider": null
              }
            ],
            "placement_fee": null,
            "shareable_basic_profile": [
              "NAME",
              "EMAIL",
              "PHONE"
            ]
          },
          "product": {
            "code": "b-o-hi-m-tai-n-n-1640094417-098",
            "product_type_code": "insurance:health-insurance:for-individual",
            "display_name": "Bảo hiểm tai nạn",
            "description": "",
            "created_at": "2021-12-21T13:46:58.307492Z",
            "updated_at": "2021-12-21T13:46:58.307492Z",
            "detail": null,
            "conversion_commissions": [
              {
                "name": "hdi-tai-nan-1-agency-fee",
                "display_name": "Bảo hiểm tai nạn - Agency Fee",
                "includes_vat": false,
                "rate": 20,
                "fixed_value": null
              },
              {
                "name": "hdi-tai-nan-2-bonus-agency-support",
                "display_name": "Bảo hiểm tai nạn - Bonus Agency Support",
                "includes_vat": false,
                "rate": 20,
                "fixed_value": null
              },
              {
                "name": "hdi-tai-nan-3-service-fee",
                "display_name": "Bảo hiểm tai nạn - Service Fee",
                "includes_vat": false,
                "rate": 10,
                "fixed_value": null
              }
            ],
            "id": "262ef210-d2c6-4621-8393-fd55c1e24f4c",
            "consumer_id": "cc61532e-4668-4bee-b8c1-95fd0bec7f09",
            "custom_scopes": [],
            "consumer": null,
            "website_url": "",
            "thumbnail_url": "",
            "banner_url": "",
            "term_of_use_url": "",
            "required_claims": null,
            "custom_fields": {}
          },
          "tenor": {
            "value": 3,
            "unit": "MONTH"
          },
          "total_amount": {
            "value": "10000000",
            "currency": "VND"
          },
          "transaction_amount": {
            "value": "9000000",
            "currency": "VND"
          },
          "period_amount": {
            "value": "1000000",
            "currency": "VND"
          },
          "down_payment": {
            "value": "1000000",
            "currency": "VND"
          }
        }
      ]
    })
  })


  return api
}
