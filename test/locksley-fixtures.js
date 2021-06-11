function makeStockArray() {
  return [
    {
      id: 1,
      stock_symbol: "MSFT",
      stock_name: "Microsoft Corp",
      stock_volume: "10284461",
      stock_previous_close: "250.78999",
      stock_percent_change: "2.63963",
      stock_close: "257.40991",
      stock_open: "249.98000",
      fiftytwo_week_high: "263.19000",
      fiftytwo_week_low: "184.00999"
    }
  ];
}

module.exports = {
  makeStockArray,
};
