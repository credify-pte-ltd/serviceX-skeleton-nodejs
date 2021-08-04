const create = async (req, res, { credify, user, composeClaimObject, organizationId }) => {
  console.log(JSON.stringify(req.body));
  if (!req.body.id || !req.body.password) {
    return res.status(400).send({ message: "Invalid body" });
  }

  let keys = {};
  if (req.body.encryption_public_key) { keys["encryptionPublicKey"] = req.body.encryption_public_key }
  if (req.body.encryption_secret) { keys["encryptionSecret"] = req.body.encryption_secret }
  if (req.body.signing_public_key) { keys["signingPublicKey"] = req.body.encryption_public_key }
  if (req.body.signing_secret) { keys["signingSecret"] = req.body.signing_secret }

  if (Object.keys(keys).length === 0) {
    keys = undefined;
  } else if (Object.keys(keys).length !== 4) {
    return res.status(400).send({ message: "Invalid key pairs"});
  }

  try {
    const internalId = req.body.id;
    const password = req.body.password;
    const u = await user.findByPk(internalId);
    const profile = {
      name: {
        first_name: u.firstName,
        last_name: u.lastName,
      },
      phones: [
        {
          phone_number: u.phoneNumber,
          country_code: u.phoneCountryCode,
        }
      ],
      emails: [
        {
          email: u.email,
        }
      ]
    };

    const id = await credify.entity.create(profile, password, keys);
    console.log(id);
    await u.update({ credifyId: id });
    const claims = composeClaimObject(u);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    // Wait for sync on BE;
    await delay(3000);

    const commitments = await credify.claims.push(organizationId, id, claims);

    console.log(commitments);
    // TODO: store 'commitments' to DB
    res.json({ id });
  } catch (e) {
    console.log(JSON.stringify(e));
    res.status(500).send({ message: e.message });
  }
};

module.exports = create;
