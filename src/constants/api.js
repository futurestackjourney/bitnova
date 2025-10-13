
// Apis for fetching cryptocurrency data.that display market information. 
const CRYPTO_API_BASE = "https://api.coingecko.com/api/v3";

const API_ENDPOINTS = {
  markets: (currency) =>
    `${CRYPTO_API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
  coinDetail: (id) => `${CRYPTO_API_BASE}/coins/${id}`,
};


export { API_ENDPOINTS, CRYPTO_API_BASE };