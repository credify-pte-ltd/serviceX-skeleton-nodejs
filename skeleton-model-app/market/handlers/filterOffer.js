const extractToken = require("../utils/extractToken")

const filterOffer = async (req, res, { user, credify, personalizeOffers }) => {
  const token = extractToken(req)
  const introspectResult = await credify.auth.introspectTokenReturnResult(token)
  let validToken
  if (
    introspectResult.data &&
    introspectResult.data.active &&
    introspectResult.data.scope.includes("claim_provider")
  ) {
    validToken = true
  }

  if (!validToken) {
    return res.status(401).send({ message: "Unauthorized" })
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
    const personalizedOffers = personalizeOffers(u, offers)

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
