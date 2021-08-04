const setupOidc = async (
  req,
  res,
  { credify, db, platform, organizationId, redirectUrl, scopes }
) => {
  const state = Math.random().toString()
  const responseType = "token"
  const responseMode = "fragment"
  const options = { state, responseMode, responseType }
  if (req.query.phone_number) {
    options.phoneNumber = req.query.phone_number
  } else if (req.query.entity_id) {
    options.userId = req.query.entity_id
  }
  if (req.query.offer_code) {
    options.offerCode = req.query.offer_code
  }

  try {
    const { oidcUrl, privateKey } = await credify.oidc.initiateOIDC(
      organizationId,
      redirectUrl,
      scopes,
      options
    )

    await db.Request.create({
      state,
      privateKey,
      platform,
    })

    res.redirect(oidcUrl)
  } catch (e) {
    res.send(e)
  }
}

module.exports = setupOidc
