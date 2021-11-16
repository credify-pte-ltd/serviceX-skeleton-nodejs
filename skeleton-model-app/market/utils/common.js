const injectBasicProfileScope = (claims, user, commitments) => {
  claims[`phone`] = {
    [`phone_number`]: `${user.phoneCountryCode}${user.phoneNumber}`,
    [`phone_number_commitment`]: commitments ? commitments[`phone`] : undefined,
  }

  claims[`profile`] = {
    [`family_name`]: `${user.lastName}`,
    [`given_name`]: `${user.firstName}`,
    [`profile_commitment`]: commitments ? commitments[`profile`] : undefined,
  }

  claims[`email`] = {
    [`email`]: `${user.email}`,
    [`email_commitment`]: commitments ? commitments[`email`] : undefined,
  }

  claims[`address`] = {
    address: {
      [`formatted`]: `${user.address}`,
    },
    [`address_commitment`]: commitments ? commitments[`address`] : undefined,
  }
}

module.exports = {
  injectBasicProfileScope,
}
