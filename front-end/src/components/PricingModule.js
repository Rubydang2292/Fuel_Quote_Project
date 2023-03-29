export function pricingCalculate(
  gallons,
  locationFactor,
  currentPrice,
  rateHistoryFactor,
  gallonRequestedFactor,
  companyProfitFactor
) {
  const margin =
    currentPrice *
    (locationFactor -
      rateHistoryFactor +
      gallonRequestedFactor +
      companyProfitFactor);

  const suggested_price = currentPrice + margin;

  const total_amount = gallons * suggested_price;

  return [suggested_price, total_amount];
}
