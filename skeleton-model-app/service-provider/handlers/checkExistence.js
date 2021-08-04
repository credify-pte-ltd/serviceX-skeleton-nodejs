const extractToken = require("../utils/extractToken")

const checkExistence = async (req, res, { user, credify }) => {
  console.log(JSON.stringify(req.body))
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
  const phoneNumber = req.query.phone_number
  const idNumber = req.query.id_number
  const document = req.query.id_document
  if (!phoneNumber && !idNumber && !document) {
    return res.status(400).send({ message: "Invalid query" })
  }
  if (!phoneNumber) {
    return res
      .status(403)
      .send({ message: "This does not support checking with ID" })
  }
  // Interaction part:
  try {
    const r = await user.findAll({ where: { hashedPhoneNumber: phoneNumber } })
    const exists = r.length > 0
    res.send({ data: { exists } })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send(e)
  }
}

module.exports = checkExistence
