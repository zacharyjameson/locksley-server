function makeStockArray() {
  return (
    {
      id: 1,
      stock_symbol: "AAPL",
      stock_values: JSON.stringify([{"close": "422.26001", "datetime": "2021-06-07", "high": "422.78000", "low": "421.19000", "open": "422.58200", "volume": "41816890"}, {"close": "422.44000", "datetime": "2021-06-04", "high": "422.92001", "low": "418.76999", "open": "418.76999", "volume": "47128808"}, {"close": "418.81000", "datetime": "2021-06-03", "high": "419.98999", "low": "416.28000", "open": "417.87329", "volume": "54024375"}, {"close": "420.35999", "datetime": "2021-06-02", "high": "421.22000", "low": "419.29501", "open": "420.35999", "volume": "41889166"}, {"close": "419.63000", "datetime": "2021-06-01", "high": "422.72000", "low": "419.20001", "open": "422.56000", "volume": "49022824"}, {"close": "420.04001", "datetime": "2021-05-28", "high": "421.25000", "low": "419.79001", "open": "420.96210", "volume": "50554335"}, {"close": "419.22000", "datetime": "2021-05-27", "high": "420.72000", "low": "419.12000", "open": "420.17209", "volume": "50645184"}])
    }
  );
}

module.exports = {
  makeStockArray,
};
