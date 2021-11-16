const extractToken = require("../utils/extractToken")
const { PERMISSION_SCOPE } = require("../utils/constants")

const evaluate = async (req, res, { user, credify, composeClaimObject }) => {
  const token = extractToken(req)
  try {
    const validToken = await credify.auth.introspectToken(
      token,
      PERMISSION_SCOPE.READ_EVALUATED_OFFER
    )
    if (!validToken) {
      return res.status(401).send({ message: "Unauthorized" })
    }
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }

  if (!req.body.credify_id || !req.body.scopes) {
    return res.status(400).send({ message: "Invalid body" })
  }
  let conditions = req.body.conditions || [{}]
  conditions = conditions.map((c) => {
    return c === null ? {} : c
  })
  const requiredCustomScopes = req.body.required_custom_scopes || []

  //*** Your implementation start from here. The code below is just for reference

  try {
    const users = await user.findAll({
      where: { credifyId: req.body.credify_id },
    })
    if (users.length !== 1) {
      return res.status(500).send({ message: "Not found user properly" })
    }
    const u = users[0]
    let allUserClaims = composeClaimObject(u)
    const sharedScopes = req.body.scopes
    let userSharedClaims = {}
    for (let scope of sharedScopes) {
      userSharedClaims[scope] = allUserClaims[scope]
    }
    //*** Our SDK already supports offer evaluation for you
    const result = await credify.offer.evaluateOffer(
      conditions,
      requiredCustomScopes,
      userSharedClaims
    )
    const response = {
      data: {
        rank: result.rank,
        used_scopes: result.usedScopes,
        requested_scopes: result.requestedScopes,
      },
    }
    res.json(response)
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

module.exports = evaluate
