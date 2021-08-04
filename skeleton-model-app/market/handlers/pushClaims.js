const pushClaims = async (req, res, { credify, user, commitment, composeClaimObject, organizationId }) => {
  console.log(JSON.stringify(req.body));
  if (!req.body.id || !req.body.credify_id) {
    return res.status(400).send({ message: "Invalid body" });
  }

  try {
    const internalId = req.body.id;
    const credifyId = req.body.credify_id;
    const u = await user.findByPk(internalId);
    await u.update({ credifyId: credifyId });
    const claims = composeClaimObject(u);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    // Wait for sync on BE;
    await delay(3000);

    const commitments = await credify.claims.push(organizationId, credifyId, claims);
    console.log(commitments);

    const obj = {
      credifyId: credifyId,
      values: commitments,
      platform: null, // NOTE: for future use.
    };
    const c = await commitment.findOne({ where: { credifyId } });
    console.log(c);
    if (c) {
      await c.update(obj);
    } else {
      await commitment.create(obj);
    }
    res.json({ credifyId });
  } catch (e) {
    // console.log(e)
    console.log(JSON.stringify(e));
    res.status(500).send({ message: e.message });
  }
};

module.exports = pushClaims;
