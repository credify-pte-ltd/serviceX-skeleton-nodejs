const {upsertCommitments, authenticateInternalUser, updateUserId, fetchUserClaimObject} = require("../dataInteraction");
const {DISBURSEMENT_DOCS} = require("../utils/constants");

const pushDisbursementClaims = async (req, res, { db, credify }) => {

  const validRequest = await authenticateInternalUser(db, req);
  if (!validRequest) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  const organizationId = process.env.APP_ID
  if (!organizationId) {
    return res.status(400).send({ message: "Please recheck config - organization ID" })
  }

  if (!req.body.order_id || !req.body.documents || !req.body.credify_id) {
    return res.status(400).send({ message: "Invalid body" })
  }

  try {
    const orderId = req.body.order_id
    const documents = req.body.documents
    const credifyId = req.body.credify_id

    const BNPL_ORDER = "bnpl_order";
    const COMMITMENT = "commitment";
    const claims = {};
    if (!documents || !Object.keys(documents).length) return claims;
    Object.keys(documents).forEach((key) => {
      let claimKey, documentContent, commitmentKey;
      if (
        key === DISBURSEMENT_DOCS.INVOICE.toLowerCase() ||
        key === DISBURSEMENT_DOCS.DOWN_PAYMENT.toLowerCase() ||
        key === DISBURSEMENT_DOCS.FIRST_PAYMENT.toLowerCase() ||
        key === DISBURSEMENT_DOCS.DELIVERY.toLowerCase()
      ) {
        claimKey = `${BNPL_ORDER}:${orderId}:${key}`;
        documentContent = documents[key];
        commitmentKey = `${BNPL_ORDER}:${orderId}:${key}:${COMMITMENT}`;
      }

      claims[`${BNPL_ORDER}:${orderId}:${key}`] = {
        [`${BNPL_ORDER}:${orderId}:${key}`]: {
          content_type: "pdf",
          content: documentContent,
        },
      };
    });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
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

module.exports = pushDisbursementClaims
