const PERMISSION_SCOPE = {
  COUNT_USER: "oidc_client:read_user_counts",
  READ_EVALUATED_OFFER: "individual:read_evaluated_offer",
  READ_FILTER_OFFER: "claim_provider:read_filtered_offers",
}

const DEFAULT_PATH = {
  PUSH_CLAIMS: "/push-claims",
  OFFERS_FILTERING: "/offers-filtering",
  USER_COUNTS: "/user-counts",
  OFFER_EVALUATION: "/offer-evaluation",
  ENCRYPTED_CLAIMS: "/encrypted-claims",
};

const STANDARD_SCOPES = ["phone", "email", "address", "profile"];

module.exports = {
  PERMISSION_SCOPE,
  DEFAULT_PATH,
  STANDARD_SCOPES,
}
