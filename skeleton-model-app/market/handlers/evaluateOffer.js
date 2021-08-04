const extractToken = require("../utils/extractToken")

const evaluate = async (req, res, { user, credify, evaluateOffer }) => {
  console.log(JSON.stringify(req.body))
  const token = extractToken(req)
  const validToken = await credify.auth.introspectToken(
    token,
    "individual:read_evaluated_offer"
  )
  if (!validToken) {
    return res.status(401).send({ message: "Unauthorized" })
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
      throw new Error("Not found user properly")
    }
    const u = users[0]

    const result = evaluateOffer(
      u,
      conditions,
      req.body.scopes,
      requiredCustomScopes
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
    console.log(JSON.stringify(e))
    res.status(500).send({ message: e.message })
  }
}

module.exports = evaluate
