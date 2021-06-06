const StockService = {
  getAllStocks(knex) {
    return knex.select("*").from("locksley_stocks");
  },

  insertStock(knex, newStock) {
    return knex
      .insert(newStock)
      .into("locksley_stocks")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getBySymbol(knex, symbol) {
    return knex
      .from("locksley_stocks")
      .select("*")
      .where("stock_symbol", symbol);
  },

  deleteStock(knex, stockSymbol) {
    return knex.raw(
      `DELETE FROM locksley_stocks WHERE stock_symbol='${stockSymbol}'`
    );
  },

  clearAllStocks(knex) {
    return knex.raw("TRUNCATE TABLE locksley_stocks RESTART IDENTITY CASCADE");
  },
};

module.exports = StockService;
