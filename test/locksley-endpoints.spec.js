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
        stock_symbol: "AAPL",
        stock_values: '[{"close": "422.26001", "datetime": "2021-06-07", "high": "422.78000", "low": "421.19000", "open": "422.58200", "volume": "41816890"}, {"close": "422.44000", "datetime": "2021-06-04", "high": "422.92001", "low": "418.76999", "open": "418.76999", "volume": "47128808"}, {"close": "418.81000", "datetime": "2021-06-03", "high": "419.98999", "low": "416.28000", "open": "417.87329", "volume": "54024375"}, {"close": "420.35999", "datetime": "2021-06-02", "high": "421.22000", "low": "419.29501", "open": "420.35999", "volume": "41889166"}, {"close": "419.63000", "datetime": "2021-06-01", "high": "422.72000", "low": "419.20001", "open": "422.56000", "volume": "49022824"}, {"close": "420.04001", "datetime": "2021-05-28", "high": "421.25000", "low": "419.79001", "open": "420.96210", "volume": "50554335"}, {"close": "419.22000", "datetime": "2021-05-27", "high": "420.72000", "low": "419.12000", "open": "420.17209", "volume": "50645184"}])'
      };

      return supertest(app)
        .post("/api/stocks")
        .send(newStock)
        .expect(201)
        .expect((res) => {
          expect(res.body.stock_symbol).to.eql(newStock.stock_symbol);
          expect(res.body.stock_values).to.eql(newStock.stock_values);
          expect(res.body).to.have.property("id");
        });
    });

    const requiredFields = ["stock_symbol", "stock_values"];

    requiredFields.forEach((field) => {
      const newStocks = {
        stock_symbol: "AAPL",
        stock_values: '[{"close": "422.26001", "datetime": "2021-06-07", "high": "422.78000", "low": "421.19000", "open": "422.58200", "volume": "41816890"}, {"close": "422.44000", "datetime": "2021-06-04", "high": "422.92001", "low": "418.76999", "open": "418.76999", "volume": "47128808"}, {"close": "418.81000", "datetime": "2021-06-03", "high": "419.98999", "low": "416.28000", "open": "417.87329", "volume": "54024375"}, {"close": "420.35999", "datetime": "2021-06-02", "high": "421.22000", "low": "419.29501", "open": "420.35999", "volume": "41889166"}, {"close": "419.63000", "datetime": "2021-06-01", "high": "422.72000", "low": "419.20001", "open": "422.56000", "volume": "49022824"}, {"close": "420.04001", "datetime": "2021-05-28", "high": "421.25000", "low": "419.79001", "open": "420.96210", "volume": "50554335"}, {"close": "419.22000", "datetime": "2021-05-27", "high": "420.72000", "low": "419.12000", "open": "420.17209", "volume": "50645184"}])'
      };

      it(`responds with 400 and an error when the ${field} is missing`, () => {
        delete newStocks[field];

        return supertest(app)
          .post("/api/stocks")
          .send(newStocks)
          .expect(400, {
            error: { message: `Missing ${field} in request body` },
          });
      });
    });
  });

  describe(`DELETE /api/stocks/:stock_symbol`, () => {
    context(`Given no stocks in the database`, () => {
      it(`it responds with 404`, () => {
        const stockSymbol = 123456;

        return supertest(app)
          .delete(`/api/stocks/${stockSymbol}`)
          .expect(404, { error: { message: `Stock doesn't exist` } });
      });
    });

    context(`Given there are stocks in the database`, () => {
      const testStocks = makeStockArray();

      beforeEach("insert stocks", () => {
        return db.into("locksley_stocks").insert(testStocks);
      });

      it(`responds with 204 and then removes the stock`, () => {
        const stockToRemove = "MSFT";
        const expectedStock = testStocks.filter(
          (stock) => stock.stock_symbol !== stockToRemove
        );

        return supertest(app)
          .delete(`/api/stocks/${stockToRemove}`)
          .expect(204)
          .then((res) => {
            supertest(app).get("/api/stocks").expect(expectedStock);
          });
      });
    });
  });
});
