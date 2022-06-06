////////////////////////////////////////////
// REQUIRED IMPLEMENTATION
////////////////////////////////////////////

/**
 * This returns Credify scope object for a specified user.
 *
 * @param db DB object. This can be `undefined` upon your configuration.
 * @param localId string. Internal ID in your system
 * @param credifyId string. Credify ID
 * @param includingScopes string[]. If this is empty, it means all scopes.
 * @param withCommitments boolean. If this is true, `commitment` should be added into the scope object.
 * @returns {Promise<Object|null>}
 */
const fetchUserClaimObject = async (db, localId, credifyId, includingScopes, withCommitments) => {
  const user = await fetchUser(db, localId, credifyId)

  if (!user) {
    return null;
  }

  const shareableProfile = (process.env.APP_PROVIDING_BASIC_PROFILE || "").split(",").map((p) => p.toUpperCase());
  const claims = {};

  let commitments = undefined;
  if (withCommitments) {
    commitments = await fetchCommitment(db, credifyId);
  }

  // Add advanced scopes

  const scopeName = "40f9a736-0d97-409b-a0f7-d23ebca20bde:loyalty-point-data-1653892708";
  if (includingScopes.length === 0 || includingScopes.includes(scopeName)) {
    claims[scopeName] = {
      "40f9a736-0d97-409b-a0f7-d23ebca20bde:amount-1653892708": user.loyaltyPoint,
      "40f9a736-0d97-409b-a0f7-d23ebca20bde:tier-1653892708": user.tier,
      [`${scopeName}:commitment`]: commitments ? commitments[scopeName] : undefined,
    }
  }

  // Add basic scopes

  if (includingScopes.length === 0 || includingScopes.includes("phone")) {
    if (shareableProfile.includes("PHONE")) {
      claims[`phone`] = {
        [`phone_number`]: `${user.phoneCountryCode}${user.phoneNumber}`,
        [`phone_commitment`]: commitments ? commitments[`phone`] : undefined,
      };
    }
  }

  if (includingScopes.length === 0 || includingScopes.includes("profile")) {
    if (shareableProfile.includes("NAME")) {
      claims[`profile`] = {
        [`family_name`]: `${user.lastName}`,
        [`given_name`]: `${user.firstName}`,
        [`profile_commitment`]: commitments ? commitments[`profile`] : undefined,
      };
    }
    if (shareableProfile.includes("DOB")) {
      claims[`profile`] = {
        ...claims[`profile`],
        [`birthdate`]: `${user.dob}`,
        [`profile_commitment`]: commitments ? commitments[`profile`] : undefined,
      };
    }
    if (shareableProfile.includes("GENDER")) {
      claims[`profile`] = {
        ...claims[`profile`],
        [`gender`]: `${user.gender}`,
        [`profile_commitment`]: commitments ? commitments[`profile`] : undefined,
      };
    }
  }

  if (includingScopes.length === 0 || includingScopes.includes("email")) {
    if (shareableProfile.includes("EMAIL")) {
      claims[`email`] = {
        [`email`]: `${user.email}`,
        [`email_commitment`]: commitments ? commitments[`email`] : undefined,
      };
    }
  }

  if (includingScopes.length === 0 || includingScopes.includes("address")) {
    if (shareableProfile.includes("ADDRESS")) {
      claims[`address`] = {
        address: {
          [`formatted`]: `${user.address}`,
        },
        [`address_commitment`]: commitments ? commitments[`address`] : undefined,
      };
    }
  }

  return claims
}

/**
 * This returns Credify verification info object
 * Please do not change the object structure
 *
 * @param db
 * @param credifyId
 * @returns {Promise<{phone: {country_code: (string|*), phone_number}, profile: {given_name: *, family_name: *}, email: {email}}>}
 */
const fetchVerificationInfo = async (db, credifyId) => {
  const user = await fetchUser(db, undefined, credifyId);
  return {
    phone: {
      phone_number: user.phoneNumber,
      country_code: user.phoneCountryCode,
    },
    email: {
      email: user.email,
    },
    profile: {
      family_name: user.lastName,
      given_name: user.firstName,
    }
  }
}

/**
 * This updates user's Credify ID
 * Please keep the CredifyID in your system for the later use.
 *
 * @param db
 * @param localId (optional)
 * @param credifyId
 * @returns {Promise<void>}
 */
const updateUserId = async (db, localId, credifyId) => {
  if (!credifyId) {
    throw new Error("This requires credify ID")
  }
  const u = await fetchUser(db, localId, credifyId);
  await u.update({ credifyId });
}

/**
 * This inserts/updates commitment model into DB
 * Please keep the commitment object for the later use.
 *
 * @param db
 * @param credifyId
 * @param commitments
 * @returns {Promise<void>}
 */
const upsertCommitments = async (db, credifyId, commitments) => {
  const obj = {
    credifyId,
    values: commitments
  }
  const c = await db.Commitment.findOne({ where: { credifyId } })
  if (c) {
    await c.update(obj)
  } else {
    await db.Commitment.create(obj)
  }
}

/**
 * This authenticates user by your own logic.
 * This is used in `push-claim` function.
 *
 * @param db
 * @param req (Express req object)
 * @returns {Promise<boolean>}
 */
const authenticateInternalUser = async (db, req) => {
  // Your service's specific authentication logic.
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 1000);
  });
}

/**
 * This is an endpoint of webhook. You will need to register this exactly same endpoint at Dashboard to receive webhook from us.
 * @type {string}
 */
const webhookEndpoint = "https://example.com/api/v1/webhook";

/**
 * This handles webhook requests sent by us.
 * The webhook requests have a signature that proves the quests are coming from us.
 * The signature verification is handled before calling this handler.
 * Ref: https://developers.credify.one/guide/webhook.html#webhook
 *
 * What this handler should do is
 * 1. Check the type of this webhook
 *    - Offer transaction status update
 *    - Dispute completion
 *    - Payment completion (BNPL)
 * 2. Do what you need accordingly
 *
 * @param db
 * @param req
 * @returns {Promise<void>}
 */
const handleWebhook = async (db, req) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 1000);
  });
}



/////////////////////////////////////////////////////////////
// Private methods (please modify the following as you like.)
/////////////////////////////////////////////////////////////

/**
 * This retrieves user model from DB
 * The key will be either local (internal) ID or Credify ID
 *
 * @param db
 * @param localId
 * @param credifyId
 * @returns {Promise<Model|null>}
 */
const fetchUser = async (db, localId, credifyId) => {
  let u = null;

  if (credifyId) {
    const users = await db.Users.findAll({ where: { credifyId } })
    if (users.length === 1) {
      u = users[0]
    }
  }
  if (u === null && localId) {
    u = await db.Users.findByPk(localId)
  }
  return u;
}


/**
 * This retrieves commitment model from DB
 *
 * @param db
 * @param credifyId
 * @returns {Promise<Object|null>}
 */
const fetchCommitment = async (db, credifyId) => {
  const model = await db.Commitment.findOne({ where: { credifyId } })
  if (model) {
    return model.values;
  }
  return null;
}



module.exports = {
  fetchVerificationInfo,
  fetchUserClaimObject,
  updateUserId,
  upsertCommitments,
  authenticateInternalUser,
  webhookEndpoint,
  handleWebhook,
}
