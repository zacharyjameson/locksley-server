const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");
const { makeStockArray } = require("./locksley-fixtures");

describe("Stocks Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE locksley_stocks RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE locksley_stocks RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/stocks`, () => {
    context(`Given no stocks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/stocks").expect(200, []);
      });
    });

    context(`Given there are stocks in the database`, () => {
      const testStocks = makeStockArray();

      beforeEach("insert stock", () => {
        return db.into("locksley_stocks").insert(testStocks);
      });

      it(`responds with 200 and all of the stocks`, () => {
        return supertest(app).get("/api/stocks").expect(200, testStocks);
      });
    });
  });

  describe("POST /api/stocks", () => {
    it(`adds a new stock to the database`, () => {
      const newStock = {
        symbol: "AAPL",
        stock_values: [
          {
            date_info: "2021-06-04",
            price_open: "124.04000",
            price_high: "125.36000",
            price_low: "123.85000",
            price_close: "124.92000",
            volume: "18013682",
          },
        ],
      };

      return supertest(app).post("/api/stocks").send(newStock);
    });
  });
});
