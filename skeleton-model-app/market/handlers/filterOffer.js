const { PERMISSION_SCOPE } = require("../utils/constants")

const extractToken = require("../utils/extractToken")

const filterOffer = async (req, res, { user, credify, composeClaimObject }) => {
  const token = extractToken(req)
  try {
    const validToken = await credify.auth.introspectToken(
      token,
      PERMISSION_SCOPE.READ_FILTER_OFFER
    )
    if (!validToken) {
      return res.status(401).send({ message: "Unauthorized" })
    }
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }

  const credifyId = req.body.credify_id
  const localId = req.body.local_id
  const offers = req.body.offers
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

  try {
    if (!offers.length) {
      const response = {
        data: {
          offers: [],
        },
      }
      return res.status(200).json(response)
    }
    let u

    //*** Your implementation start from here. The code below is just for reference
    if (credifyId) {
      const users = await user.findAll({ where: { credifyId } })
      if (users.length !== 1) {
        throw new Error("Not found user properly")
      }
      u = users[0]
    } else if (localId) {
      u = await user.findByPk(localId)
    }
    const personalizedOffers = []
    await offers.forEach(async (offer) => {
      const userClaims = composeClaimObject(u)
      //*** Our SDK already supports offer evaluation for you
      const result = await credify.offer.evaluateOffer(
        offer.conditions,
        offer.required_custom_scopes,
        userClaims
      )

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
    })

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
