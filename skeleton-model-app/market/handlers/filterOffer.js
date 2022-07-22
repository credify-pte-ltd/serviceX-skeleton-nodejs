const { PERMISSION_SCOPE } = require("../utils/constants")
const extractToken = require("../utils/extractToken")
const {fetchUserClaimObject} = require("../dataInteraction");

const filterOffer = async (req, res, { db, credify }) => {
  console.log("1111111111111111")
  if (process.env.CONTEXT_ENV !== "Jest") {
    try {
      console.log(JSON.stringify(req.body))
      const token = extractToken(req)
      const validToken = await credify.auth.introspectToken(
        token,
        PERMISSION_SCOPE.READ_FILTER_OFFER
      )
      if (!validToken) {
        return res.status(401).send({message: "Unauthorized"})
      }
    } catch (e) {
      return res.status(500).send({message: e.message})
    }
  }

  console.log("AAAAAAAAAAAAAAAAAa")

  const credifyId = req.body.credify_id
  const localId = req.body.local_id
  const offers = req.body.offers

  console.log("BBBBBBBBBBBBBBB")
  console.log(credifyId)
  console.log(localId)
  console.log(offers.length)

  if (!credifyId && !localId) {
    return res.status(400).send({ message: "No ID found" })
  }
  if (offers === undefined) {
    const response = {
      data: {
        offers: [],
      },
    }
    return res.status(200).json(response)
  }

  console.log("CCCCCCCCCCCCCCc")

  try {
    if (!offers.length) {
      const response = {
        data: {
          offers: [],
        },
      }
      return res.status(200).json(response)
    }

    console.log("DDDDDDDDDDDDD")


    const userClaims = await fetchUserClaimObject(db, localId, credifyId, [], false);

    console.log("EEEEEEEEEEEE")
    const personalizedOffers = []

    await Promise.all((offers.map(async (offer) => {
      const result = await credify.offer.evaluateOffer(
        offer.conditions,
        offer.required_custom_scopes || [],
        userClaims
      )

      console.log("FFFFFFFFFFFFF")


      const formattedOffer = {
        ...offer,
        evaluation_result: {
          rank: result.rank,
          used_scopes: result.usedScopes,
          requested_scopes: result.requestedScopes,
        },
      }

      if (result.rank > 0) {
        // Return only qualified offers
        personalizedOffers.push(formattedOffer)
      }
    })))

    console.log("GGGGGGGGGGGGG")

    const response = {
      data: {
        offers: personalizedOffers,
      },
    }
    res.json(response)
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

module.exports = filterOffer
