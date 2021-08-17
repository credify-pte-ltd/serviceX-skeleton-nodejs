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
  const phoneNumber = req.body.phone_number
  const idNumber = req.body.id_number
  const document = req.body.id_document
  if (!phoneNumber && !idNumber && !document) {
    return res.status(400).send({ message: "Invalid query" })
  }
  if (!phoneNumber) {
    return res
      .status(403)
      .send({ message: "This does not support checking with ID" })
  }
  //*** Your implementation start from here. The code below is just for reference
  try {
    const r = await user.findAll({ where: { phoneNumber } })
    const exists = r.length > 0
    res.send({ data: { exists } })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(500).send(e)
  }
}

module.exports = checkExistence
