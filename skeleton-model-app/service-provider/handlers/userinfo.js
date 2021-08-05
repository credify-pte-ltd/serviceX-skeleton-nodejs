const userinfo = async (req, res, { db, credify }) => {
  if (!req.body.access_token || !req.body.state) {
    return res.status(400).send({ message: "Invalid body" })
  }
  const accessToken = req.body.access_token
  const state = req.body.state

  try {
    const request = await db.Request.findAll({ where: { state } })
    if (request.length < 1) {
      throw new Error("Request not found.")
    }
    const encryptionPrivateKey = request[0].privateKey

    const data = await credify.oidc.userinfo(accessToken, encryptionPrivateKey)
    res.send({ ...data })
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = userinfo
