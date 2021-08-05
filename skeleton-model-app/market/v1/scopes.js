const common = require("../utils/common")
const { CONDITIONS } = require("../utils/constants")

const scopeNames = [
  "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data",
  "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score",
]
const scopesDefinition = [
  {
    id: "43d51e25-9606-11ea-8c5d-5e3f1841c6e1",
    provider_id: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0",
    name: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data",
    display_name: "Sendo History Data",
    description: "",
    price: 8,
    is_onetime_charge: false,
    is_active: true,
    claims: [
      {
        id: "43d8d46c-9606-11ea-8c5d-5e3f1841c6e1",
        scope_id: "43d51e25-9606-11ea-8c5d-5e3f1841c6e1",
        main_claim_id: "",
        scope: {
          name: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data",
        },
        name: "3285592c-9aaf-4182-bff5-941ce5dac483:purchase-count",
        display_name: "Purchase count",
        description: "",
        value_type: "INTEGER",
        min_value: 0,
        max_value: 1000,
        is_active: true,
        created_at: "2021-02-20T07:56:50.009748Z",
        updated_at: "2021-02-20T07:56:50.009749Z",
        nested: null,
      },
      {
        id: "43d8d46c-9606-11ea-8c5d-5e3f1841c6e1",
        scope_id: "43d51e25-9606-11ea-8c5d-5e3f1841c6e1",
        main_claim_id: "",
        scope: {
          name: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data",
        },
        name: "3285592c-9aaf-4182-bff5-941ce5dac483:total-payment-amount",
        display_name: "Total payment amount",
        description: "",
        value_type: "FLOAT",
        min_value: 0,
        max_value: 1000000,
        is_active: true,
        created_at: "2021-02-20T07:56:50.018005Z",
        updated_at: "2021-02-20T07:56:50.018005Z",
        nested: null,
      },
    ],
    created_at: "2021-02-20T07:56:50.002719Z",
    updated_at: "2021-02-20T07:56:50.002719Z",
    unit: "USD",
    provider: null,
  },
  {
    id: "350a7a49-32c1-11eb-8b7b-fa673376e2f7",
    provider_id: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0",
    name: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score",
    display_name: "Sendo Score",
    description: "",
    price: 1,
    is_onetime_charge: false,
    is_active: true,
    claims: [
      {
        id: "350ac98b-32c1-11eb-8b7b-fa673376e2f7",
        scope_id: "350a7a49-32c1-11eb-8b7b-fa673376e2f7",
        main_claim_id: "",
        scope: { name: "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score" },
        name: "3285592c-9aaf-4182-bff5-941ce5dac483:sendo%20score",
        display_name: "Sendo Score",
        description: "",
        value_type: "INTEGER",
        min_value: 0,
        max_value: 200,
        is_active: true,
        created_at: "2021-02-20T07:56:50.039579Z",
        updated_at: "2021-02-20T07:56:50.039579Z",
        nested: null,
      },
    ],
    created_at: "2021-02-20T07:56:50.031624Z",
    updated_at: "2021-02-20T07:56:50.031624Z",
    unit: "USD",
    provider: null,
  },
]

const composeClaimObject = (user, commitments) => {
  const claims = {}
  claims["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data"] = {
    "3285592c-9aaf-4182-bff5-941ce5dac483:purchase-count": `${user.transactionsCount}`,
    "3285592c-9aaf-4182-bff5-941ce5dac483:total-payment-amount": `${user.totalPaymentAmount}`,
    "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data:commitment":
      commitments
        ? commitments["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo-history-data"]
        : undefined,
  }
  claims["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score"] = {
    "3285592c-9aaf-4182-bff5-941ce5dac483:sendo%20score": `${user.creditScore}`,
    "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score:commitment": commitments
      ? commitments["b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:sendo%20score"]
      : undefined,
  }
  return claims
}

/**
 *
 * @param condition
 * @param user
 * @param usingScopes Scope name list that user is going to share
 * @returns {{qualified: boolean, scopeNames: string[]}}
 */
const checkValueCondition = (condition, user, usingScopes) => {
  const scopeName = common.lookUpScopeNameByClaimName(
    scopesDefinition,
    condition.claim.name
  )
  const userDeclined = !usingScopes.includes(scopeName)
  if (userDeclined) {
    return { qualified: false, scopeNames: [scopeName] }
  }

  if (condition.kind === CONDITIONS.CONTAIN) {
    // value here is any user's data that match the current condition
    const qualified = value.includes(claim.value)
    return { qualified, scopeNames: [scopeName] }
  }

  if (condition.kind === CONDITIONS.IN_RANGE) {
    if (
      condition.claim.name ===
      "3285592c-9aaf-4182-bff5-941ce5dac483:purchase-count"
    ) {
      const qualified =
        user.transactionsCount >= Number(condition.value) &&
        user.transactionsCount <= Number(condition.upper)
      return { qualified, scopeNames: [scopeName] }
    }
    if (
      condition.claim.name ===
      "3285592c-9aaf-4182-bff5-941ce5dac483:total-payment-amount"
    ) {
      const qualified =
        user.totalPaymentAmount >= Number(condition.value) &&
        user.totalPaymentAmount <= Number(condition.upper)
      return { qualified, scopeNames: [scopeName] }
    }
    if (
      condition.claim.name ===
      "3285592c-9aaf-4182-bff5-941ce5dac483:sendo%20score"
    ) {
      const qualified =
        user.creditScore >= Number(condition.value) &&
        user.creditScore <= Number(condition.upper)
      return { qualified, scopeNames: [scopeName] }
    }
    return { qualified: false, scopeNames: [scopeName] }
  }

  if (condition.kind === "LARGER_THAN_CONDITION") {
    // No condition that falls into this.
    return { qualified: false, scopeNames: [scopeName] }
  }

  if (condition.kind === "LARGER_THAN_OR_EQUAL_CONDITION") {
    // No condition that falls into this.
    return { qualified: false, scopeNames: [scopeName] }
  }

  if (condition.kind === "EQUALITY_CONDITION") {
    if (condition.claim.name === "b09e8f99-6d89-4e7d-83ea-a43a1787b3e0:fraud") {
      const qualified = !Boolean(condition.value)
      return { qualified, scopeNames: [scopeName] }
    }
  }
  return { qualified: false, scopeNames: [scopeName] }
}

const personalizeOffers = (user, offers) =>
  common.personalizeOffers(
    user,
    offers,
    scopeNames,
    scopesDefinition,
    checkValueCondition
  )
const evaluateOffer = (user, conditions, usingScopes, requiredCustomScopes) =>
  common.evaluateOffer(
    user,
    conditions,
    usingScopes,
    requiredCustomScopes,
    scopesDefinition,
    checkValueCondition
  )

module.exports = {
  personalizeOffers,
  evaluateOffer,
  scopeNames,
  composeClaimObject,
}
