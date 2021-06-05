function makeStockArray() {
  return [
    {
      id: 1,
      stock_symbol: "AAPL",
      stock_volume: "18013682",
      date_info: "2021-06-04",
      price_open: "124.04000",
      price_high: "125.36000",
      price_low: "123.85000",
      price_close: "124.92000",
    },
    {
      id: 2,
      stock_symbol: "AAPL",
      stock_volume: "76101500",
      date_info: "2021-06-03",
      price_open: "124.68000",
      price_high: "124.85000",
      price_low: "123.13000",
      price_close: "123.54000",
    },
    {
      id: 3,
      stock_symbol: "AAPL",
      stock_volume: "52240362",
      date_info: "2021-06-02",
      price_open: "124.28800",
      price_high: "125.24000",
      price_low: "124.05000",
      price_close: "125.09000",
    },
    {
      id: 4,
      stock_symbol: "MSFT",
      stock_volume: "67637118",
      date_info: "2021-06-01",
      price_open: "125.08000",
      price_high: "125.35000",
      price_low: "123.94500",
      price_close: "124.28000",
    },
    {
      id: 5,
      stock_symbol: "MSFT",
      stock_volume: "71232700",
      date_info: "2021-05-28",
      price_open: "125.57000",
      price_high: "125.80000",
      price_low: "124.55000",
      price_close: "124.61000",
    },
  ];
}

module.exports = {
  makeStockArray,
};
