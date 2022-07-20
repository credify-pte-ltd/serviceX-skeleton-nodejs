const {apiDomain, handleWebhook} = require("../dataInteraction");
const {DEFAULT_PATH_PREFIX, DEFAULT_PATH} = require("../utils/constants");

const webhook = async (req, res, { db, credify }) => {
  const signature = req.headers["signature"] || req.headers["Signature"];
  if (!signature) {
    return res.status(401).send({ message: "Unauthorized" })
  }
  const eventId = req.headers["X-Event-Id"] || req.headers["x-event-id"];
  if (!eventId) {
    return res.status(401).send({ message: "Unauthorized" })
  }
  const timestamp = req.headers["X-Event-Timestamp"] || req.headers["x-event-timestamp"];
  if (!timestamp) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  const trimmedDomain = apiDomain.endsWith("/") ? apiDomain.slice(0, -1) : apiDomain;
  const webhookEndpoint = `${trimmedDomain}${DEFAULT_PATH_PREFIX}${DEFAULT_PATH.WEBHOOK}`;
  const valid = await credify.auth.verifyWebhook(signature, req.body, webhookEndpoint, eventId, timestamp);
  if (!valid) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  await handleWebhook(db, req);

  return res.status(200).json({ message: "Success" });
}

module.exports = webhook;
