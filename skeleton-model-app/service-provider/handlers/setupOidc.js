const setupOidc = async (
  req,
  res,
  { credify, db, platform, organizationId, redirectUrl, scopes, responseMode, responseType }
) => {
  const state = Math.random().toString()
  const options = { state, mode: responseMode, type: responseType }
  // Either entity_id or phone_number is passed in options cause we only need one identity.
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
