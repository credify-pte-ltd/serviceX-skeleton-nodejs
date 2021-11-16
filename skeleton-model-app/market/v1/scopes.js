const common = require("../utils/common")

const composeClaimObject = (user, commitments) => {
  const claims = {}
  claims["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data"] = {
    "3285592c-9aaf-4182-bff5-941ce5dac483:purchase-count":
      user.transactionsCount,
    "3285592c-9aaf-4182-bff5-941ce5dac483:total-payment-amount":
      user.totalPaymentAmount,
    "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data:commitment":
      commitments
        ? commitments["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data"]
        : undefined,
  }
  claims["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score"] = {
    "3285592c-9aaf-4182-bff5-941ce5dac483:sendo%20score": user.creditScore,
    "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score:commitment": commitments
      ? commitments["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score"]
      : undefined,
  }
  common.injectBasicProfileScope(claims, user, commitments)
  return claims
}

module.exports = {
  composeClaimObject,
}
