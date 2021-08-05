const onlyUnique = require("./onlyUnique")
const { CONDITIONS } = require("./constants")

/**
 * Look up scope name by claim name.
 * @param scopesDefinition
 * @param claimName
 * @returns {string}
 */
const lookUpScopeNameByClaimName = (scopesDefinition, claimName) => {
  let scopeName = ""
  scopesDefinition.forEach((s) => {
    if (scopeName) {
      return
    }
    s.claims.forEach((c) => {
      if (c.name === claimName) {
        scopeName = s.name
        return
      }
    })
  })
  return scopeName
}

const checkAndCondition = (
  subconditions,
  user,
  usingScopes,
  checkValueFunc
) => {
  let totalScopeNames = []
  const validConditions = subconditions.filter((c) => {
    const { qualified, scopeNames } = check(
      c,
      user,
      usingScopes,
      checkValueFunc
    )
    if (qualified) {
      totalScopeNames = [...totalScopeNames, ...scopeNames].filter(onlyUnique)
    }
    return qualified
  })
  // All the sub conditions need to meet criterion.
  return {
    qualified: subconditions.length === validConditions.length,
    scopeNames: totalScopeNames,
  }
}

const checkOrCondition = (subconditions, user, usingScopes, checkValueFunc) => {
  let totalScopeNames = []
  const validConditions = subconditions.filter((c) => {
    const { qualified, scopeNames } = check(
      c,
      user,
      usingScopes,
      checkValueFunc
    )
    if (qualified) {
      totalScopeNames = [...totalScopeNames, ...scopeNames].filter(onlyUnique)
    }
    return qualified
  })
  // One of the sub conditions need to meet criterion.
  return { qualified: validConditions.length > 0, scopeNames: totalScopeNames }
}

const checkNotCondition = (
  subconditions,
  user,
  usingScopes,
  checkValueFunc
) => {
  if (subconditions.length !== 1) {
    return false
  }
  const { qualified, scopeNames } = checkValueFunc(
    subconditions[0],
    user,
    usingScopes
  )
  return { qualified: !qualified, scopeNames }
}

const check = (condition, user, usingScopes, checkValueFunc) => {
  if (condition.kind === CONDITIONS.AND) {
    return checkAndCondition(
      condition.subconditions,
      user,
      usingScopes,
      checkValueFunc
    )
  } else if (condition.kind === CONDITIONS.OR) {
    return checkOrCondition(
      condition.subconditions,
      user,
      usingScopes,
      checkValueFunc
    )
  } else if (condition.kind === CONDITIONS.NOT) {
    return checkNotCondition(
      condition.subconditions,
      user,
      usingScopes,
      checkValueFunc
    )
  } else {
    return checkValueFunc(condition, user, usingScopes)
  }
}

const evaluateOffer = (
  user,
  conditions,
  usingScopes,
  requiredCustomScopes,
  scopesDefinition,
  checkValueFunc
) => {
  let level = 0
  let usedScopes = []
  let requestedScopes = []
  try {
    requestedScopes = conditions
      .flatMap((c) => {
        if (c.subconditions) {
          return c.subconditions.flatMap((sb) => {
            if (sb.claim) {
              return lookUpScopeNameByClaimName(scopesDefinition, sb.claim.name)
            } else {
              const innerSb = sb.subconditions[0]
              return lookUpScopeNameByClaimName(
                scopesDefinition,
                innerSb.claim.name
              )
            }
          })
        } else if (c.claim) {
          return lookUpScopeNameByClaimName(scopesDefinition, c.claim.name)
        } else {
          return ""
        }
      })
      .filter((s) => s.length > 0)
    requestedScopes = [...requestedScopes, ...requiredCustomScopes].filter(
      onlyUnique
    )
  } catch (e) {
    console.log(e)
  }

  // Count from the back to find the best level.
  for (let i = conditions.length - 1; i >= 0; i--) {
    const condition = conditions[i]

    if (Object.keys(condition).length === 0) {
      // const qualified = requiredCustomScopes.filter((s) => usingScopes.includes(s)).length === requiredCustomScopes.length;
      // If the condition is empty, it's always qualified
      const qualified = true
      if (qualified) {
        level = 1
        usedScopes = requiredCustomScopes
        break
      }
    } else {
      const { qualified, scopeNames } = check(
        condition,
        user,
        usingScopes,
        checkValueFunc
      )
      if (qualified) {
        level = i + 1
        usedScopes = [...scopeNames, ...requiredCustomScopes].filter(onlyUnique)
        break
      }
    }
  }

  return { rank: level, usedScopes, requestedScopes }
}

const personalizeOffers = (
  user,
  offers,
  scopeNames,
  scopesDefinition,
  checkValueFunc
) => {
  const list = []
  // offers are coming from API response, so it's using snake case.
  offers.forEach((offer) => {
    // This uses all the scopes
    const result = evaluateOffer(
      user,
      offer.conditions,
      scopeNames,
      offer.required_custom_scopes || [],
      scopesDefinition,
      checkValueFunc
    )

    const formattedOffer = {
      ...offer,
      evaluation_result: {
        rank: result.rank,
        used_scopes: result.usedScopes,
        requested_scopes: result.requestedScopes,
      },
    }

    if (result.rank > 0) {
      // Return only qualified offers
      list.push(formattedOffer)
    }
  })
  return list
}

module.exports = {
  lookUpScopeNameByClaimName,
  evaluateOffer,
  personalizeOffers,
}
