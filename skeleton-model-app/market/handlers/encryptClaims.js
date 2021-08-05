const extractToken = require("../utils/extractToken")

const encryptClaims = async (
  req,
  res,
  { user, commitment, credify, composeClaimObject }
) => {
  const accessToken = extractToken(req)

  if (accessToken === "") {
    return res.status(401).send({ message: "Unauthorized" })
  }
  if (
    !req.body.user_id ||
    !req.body.request_token ||
    !req.body.approval_token
  ) {
    return res.status(400).send({ message: "Invalid body" })
  }

  const credifyId = req.body.user_id
  const requestToken = req.body.request_token
  const approvalToken = req.body.approval_token
  try {
    const { publicKey, scopes } = await credify.claims.validateRequest(
      accessToken,
      requestToken,
      approvalToken
    )

    //*** Your implementation start from here. The code below is just for reference

    const users = await user.findAll({ where: { credifyId } })
    if (users.length !== 1) {
      throw new Error("Not found user properly")
    }
    const u = users[0]

    const c = await commitment.findOne({ where: { credifyId } })
    if (!c) {
      throw new Error("Commitment not found")
    }

    const claims = composeClaimObject(u, c.values)

    const encrypted = await credify.claims.encrypt(claims, publicKey)
    const data = {
      data: {
        claims: encrypted,
      },
    }
    res.send(data)
  } catch (e) {
    res.send(e)
  }
}

module.exports = encryptClaims
