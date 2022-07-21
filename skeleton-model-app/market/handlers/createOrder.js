const {authenticateInternalAPIClient, buildOrderCreationPayload} = require("../dataInteraction");

const createOrder = async (req, res, { db, credify }) => {
  const validRequest = await authenticateInternalAPIClient(db, req);
  if (!validRequest) {
    return res.status(401).send({ message: "Unauthorized" })
  }

  const { referenceId, totalAmount, orderLines, paymentRecipient } = buildOrderCreationPayload(req)

  try {
    const data = await credify.bnpl.createOrder(
      referenceId,
      totalAmount,
      orderLines,
      paymentRecipient
    )
    res.send(data)
  } catch (e) {
    res.status(400).send({ message: e.message })
  }
}

module.exports = createOrder
