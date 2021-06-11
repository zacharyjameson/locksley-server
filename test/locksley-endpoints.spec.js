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
        console.log(testStocks);
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
        stock_symbol: "MSFT",
        stock_name: "Microsoft Corp",
        stock_volume: "10284461",
        stock_previous_close: "250.78999",
        stock_percent_change: "2.63963",
        stock_close: "257.40991",
        stock_open: "249.98000",
        fiftytwo_week_high: "263.19000",
        fiftytwo_week_low: "184.00999",
      };

      return supertest(app)
        .post("/api/stocks")
        .send(newStock)
        .expect(201)
        .expect((res) => {
          expect(res.body.stock_symbol).to.eql(newStock.stock_symbol);
          expect(res.body.stock_name).to.eql(newStock.stock_name);
          expect(res.body.stock_volume).to.eql(newStock.stock_volume);
          expect(res.body.stock_open).to.eql(newStock.stock_open);
          expect(res.body).to.have.property("id");
        });
    });

    const requiredFields = [
      "stock_symbol",
      "stock_name",
      "stock_volume",
      "stock_open",
      "stock_close",
      "stock_percent_change",
      "stock_previous_close",
      "fiftytwo_week_high",
      "fiftytwo_week_low",
    ];

    requiredFields.forEach((field) => {
      const newStocks = {
        stock_symbol: "MSFT",
        stock_name: "Microsoft Corp",
        stock_volume: "10284461",
        stock_previous_close: "250.78999",
        stock_percent_change: "2.63963",
        stock_close: "257.40991",
        stock_open: "249.98000",
        fiftytwo_week_high: "263.19000",
        fiftytwo_week_low: "184.00999",
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
