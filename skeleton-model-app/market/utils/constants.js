const PRODUCT = {
  phone: "phone",
  tv: "tv",
  laptop: "laptop",
  jewelry: "jewelry",
  book: "book",
  furniture: "furniture",
  clothes: "clothes",
  bag: "bag",
  audio: "audio",
  bike: "bike",
  car: "car",
}

const PAYMENT_METHOD = {
  cash: "cash",
  creditCard: "creditCard",
  debitCard: "debitCard",
  eWallet: "eWallet",
}

const PERMISSION_SCOPE = {
  COUNT_USER: "oidc_client:read_user_counts",
  READ_EVALUATED_OFFER: "individual:read_evaluated_offer",
  READ_FILTER_OFFER: "claim_provider:read_filtered_offers",
}

const CONDITIONS = {
  AND: "AND_CONDITION",
  OR: "OR_CONDITION",
  NOT: "NOT_CONDITION",
  CONTAIN: "CONTAIN_CONDITION",
  IN_RANGE: "IN_RANGE_CONDITION",
}
module.exports = {
  PRODUCT,
  PAYMENT_METHOD,
  PERMISSION_SCOPE,
  CONDITIONS,
}
