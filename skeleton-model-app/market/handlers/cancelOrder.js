const {authenticateInternalAPIClient } = require("../dataInteraction");

const cancelOrder = async (req, res, { db, credify }) => {
  const validRequest = await authenticateInternalAPIClient(db, req);
  if (!validRequest) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  const orderId = req.params.id

  const data = await credify.bnpl.revertPayment(orderId)
  res.send(data)
}

module.exports = cancelOrder
