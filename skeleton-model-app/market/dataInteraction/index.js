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
 * This updates user's Credify ID
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
 * This generates claim objects
 *
 * @param user User model
 * @param options { selectedScopes, commitments }
 * @returns {{}}
 */
const makeUserClaimObject = (user, { selectedScopes = [], commitments }) => {
  const shareableProfile = (process.env.APP_PROVIDING_BASIC_PROFILE || "").split(",").map((p) => p.toUpperCase());

  const claims = {};

  // Add advanced scopes

  const scopeName = "40f9a736-0d97-409b-a0f7-d23ebca20bde:loyalty-point-data-1653892708";
  if (selectedScopes.length === 0 || selectedScopes.includes(scopeName)) {
    claims[scopeName] = {
      "40f9a736-0d97-409b-a0f7-d23ebca20bde:amount-1653892708": user.transactionsCount,
      "40f9a736-0d97-409b-a0f7-d23ebca20bde:tier-1653892708": user.totalPaymentAmount,
      [`${scopeName}:commitment`]: commitments ? commitments[scopeName] : undefined,
    }
  }

  // Add basic scopes

  if (selectedScopes.length === 0 || selectedScopes.includes("phone")) {
    if (shareableProfile.includes("PHONE")) {
      claims[`phone`] = {
        [`phone_number`]: `${user.phoneCountryCode}${user.phoneNumber}`,
        [`phone_commitment`]: commitments ? commitments[`phone`] : undefined,
      };
    }
  }

  if (selectedScopes.length === 0 || selectedScopes.includes("profile")) {
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

  if (selectedScopes.length === 0 || selectedScopes.includes("email")) {
    if (shareableProfile.includes("EMAIL")) {
      claims[`email`] = {
        [`email`]: `${user.email}`,
        [`email_commitment`]: commitments ? commitments[`email`] : undefined,
      };
    }
  }

  if (selectedScopes.length === 0 || selectedScopes.includes("address")) {
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
 * This generates verification info object from user model
 *
 * @param user
 * @returns {{phone: {country_code: (string|*), phone_number}, profile: {given_name: *, family_name: *}, email: {email}}}
 */
const generateVerificationInfo = (user) => {
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
 * This retrieves commitment model from DB
 *
 * @param db
 * @param credifyId
 * @returns {Promise<Model|null>}
 */
const fetchCommitment = async (db, credifyId) => {
  return await db.Commitment.findOne({ where: { credifyId } })
}

/**
 * This inserts/updates commitment model into DB
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

module.exports = {
  fetchUser,
  updateUserId,
  makeUserClaimObject,
  generateVerificationInfo,
  fetchCommitment,
  upsertCommitments,
  authenticateInternalUser,
}
