const {authenticateInternalAPIClient } = require("../dataInteraction");

const disburse = async (req, res, { db, credify }) => {
  const validRequest = await authenticateInternalAPIClient(db, req);
  if (!validRequest) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  const orderId = req.params.id

  const data = await credify.bnpl.disbursement(orderId)
  res.send(data)
}

module.exports = disburse
