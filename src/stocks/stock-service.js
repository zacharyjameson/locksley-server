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

  deleteStock(knex, stock_symbol) {
    return knex("locksley_stocks").where({ stock_symbol }).delete();
  },

  clearAllStocks(knex) {
    return knex.raw("TRUNATE TABLE locksley_stocks RESTART IDENTITY CASCADE");
  },
};

module.exports = StockService;
