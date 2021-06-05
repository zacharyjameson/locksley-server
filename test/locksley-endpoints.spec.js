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
        stock_volume: "18013682",
        date_info: "2021-06-04",
        price_open: "124.04000",
        price_high: "125.36000",
        price_low: "123.85000",
        price_close: "124.92000",
      };

      return supertest(app)
        .post("/api/stocks")
        .send(newStock)
        .expect(201)
        .expect((res) => {
          expect(res.body.stock_symbol).to.eql(newStock.stock_symbol);
          expect(res.body.stock_volume).to.eql(newStock.stock_volume);
          expect(res.body.date_info).to.eql(newStock.date_info);
          expect(res.body.price_open).to.eql(newStock.price_open);
          expect(res.body.price_high).to.eql(newStock.price_high);
          expect(res.body.price_low).to.eql(newStock.price_low);
          expect(res.body.price_close).to.eql(newStock.price_close);
          expect(res.body).to.have.property("id");
        });
    });

    const requiredFields = ["stock_symbol", "stock_volume", "date_info", "price_open", "price_high", "price_low", "price_close"];

    requiredFields.forEach((field) => {
      const newStocks = {
        stock_symbol: "MSFT",
        stock_volume: "9237323",
        date_info: "2021-05-06",
        price_open: "248.00",
        price_high: "252.54",
        price_low: "250.62",
        price_close: "251.15"
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


});
