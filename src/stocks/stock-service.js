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

  getById(knex, id) {
    return knex.from("moviedex_movies").select("*").where("id", id).first();
  },

  deleteStock(knex, id) {
    return knex("locksley_stocks").where({ id }).delete();
  },

  clearAllStocks(knex) {
    return knex.raw("TRUNATE TABLE locksley_stocks RESTART IDENTITY CASCADE");
  },
};

module.exports = StockService;
