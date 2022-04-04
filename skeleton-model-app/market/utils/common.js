const injectBasicProfileScope = (
  claims,
  user,
  commitments,
  shareableProfile
) => {
  if (shareableProfile === null || shareableProfile.includes("PHONE")) {
    claims[`phone`] = {
      [`phone_number`]: `${user.phoneCountryCode}${user.phoneNumber}`,
      [`phone_commitment`]: commitments ? commitments[`phone`] : undefined,
    };
  }

  if (shareableProfile === null || shareableProfile.includes("NAME")) {
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
    };
  }

  if (shareableProfile.includes("GENDER")) {
    claims[`profile`] = {
      ...claims[`profile`],
      [`gender`]: `${user.gender}`,
    };
  }

  if (shareableProfile === null || shareableProfile.includes("EMAIL")) {
    claims[`email`] = {
      [`email`]: `${user.email}`,
      [`email_commitment`]: commitments ? commitments[`email`] : undefined,
    };
  }

  if (shareableProfile === null || shareableProfile.includes("ADDRESS")) {
    claims[`address`] = {
      address: {
        [`formatted`]: `${user.address}`,
      },
      [`address_commitment`]: commitments ? commitments[`address`] : undefined,
    };
  }
};

module.exports = {
  injectBasicProfileScope,
};
