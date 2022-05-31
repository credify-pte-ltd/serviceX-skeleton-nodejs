const extractToken = require("../utils/extractToken")
const {fetchUser, fetchCommitment, makeUserClaimObject, generateVerificationInfo} = require("../dataInteraction");

const encryptClaims = async (req, res, { db, credify }) => {
  let publicKey = "";
  let scopes = [];

  if (process.env.CONTEXT_ENV !== "Jest") {
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

    const requestToken = req.body.request_token
    const approvalToken = req.body.approval_token

    try {
      const result = await credify.claims.validateRequest(
        accessToken,
        requestToken,
        approvalToken
      )
      publicKey = result.publicKey;
      scopes = result.scopes;
    } catch (e) {
      return res.status(500).send({ message: e.message })
    }

  } else {
    publicKey = req.headers["public-key"];
    scopes = req.headers["scopes"].split(",");
  }

  try {
    const credifyId = req.body.user_id

    const u = await fetchUser(db, undefined, credifyId);
    if (!u) {
      return res.status(500).send({message: "Not found user properly"})
    }
    const c = await fetchCommitment(db, credifyId);
    if (!c) {
      return res.status(500).send({message: "Not found commitment properly"})
    }

    const claims = makeUserClaimObject(u, { selectedScopes: scopes, commitments: c.values });

    const encrypted = await credify.claims.encrypt(claims, publicKey)
    const verificationInfo = generateVerificationInfo(u);
    const data = {
      data: {
        verification_info: verificationInfo,
        claims: encrypted,
      },
    }
    res.send(data)
  } catch (e) {
    res.send(e)
  }
}

module.exports = encryptClaims
