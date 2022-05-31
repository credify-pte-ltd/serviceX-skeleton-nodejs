const {fetchUser, makeUserClaimObject, upsertCommitments, authenticateInternalUser, updateUserId} = require("../dataInteraction");
const pushClaims = async (req, res, { db, credify }) => {

  const validRequest = await authenticateInternalUser(db, req);
  if (!validRequest) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  const organizationId = process.env.APP_ID
  if (!organizationId) {
    return res.status(400).send({ message: "Please recheck config - organization ID" })
  }

  if (!req.body.id || !req.body.credify_id) {
    return res.status(400).send({ message: "Invalid body" })
  }

  try {
    const internalId = req.body.id
    const credifyId = req.body.credify_id
    const u = await fetchUser(db, internalId, credifyId);
    if (!u) {
      return res.status(500).send({message: "Not found user properly"})
    }
    await updateUserId(db, internalId, credifyId);
    const claims = await makeUserClaimObject(u, {});

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    // Wait for sync on BE;
    await delay(3000);

    const commitments = await credify.claims.push(
      organizationId,
      credifyId,
      claims
    )

    await upsertCommitments(db, credifyId, commitments);

    res.json({ credifyId })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}

module.exports = pushClaims
