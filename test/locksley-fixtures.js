function makeStockArray() {
  return [
    {
      id: 1,
      stock_symbol: "AAPL",
      date_info: "2021-06-04",
      price_close: "124.92000",
    },
    {
      id: 2,
      stock_symbol: "AAPL",
      date_info: "2021-06-03",
      price_close: "123.54000",
    },
    {
      id: 3,
      stock_symbol: "AAPL",
      date_info: "2021-06-02",
      price_close: "125.09000",
    },
    {
      id: 4,
      stock_symbol: "MSFT",
      date_info: "2021-06-01",
      price_close: "124.28000",
    },
    {
      id: 5,
      stock_symbol: "MSFT",
      date_info: "2021-05-28",
      price_close: "124.61000",
    },
  ];
}

module.exports = {
  makeStockArray,
};
