const path = require("path");
const express = require("express");
const xss = require("xss");
const StockService = require("./stock-service");

const stockRouter = express.Router();
const jsonParser = express.json();

const serializeStock = (stock) => ({
  id: stock.id,
  stock_symbol: stock.stock_symbol,
  stock_name: stock.stock_name,
  stock_volume: stock.stock_volume,
  stock_previous_close: stock.stock_previous_close,
  stock_percent_change: stock.stock_percent_change,
  stock_close: stock.stock_close,
  stock_open: stock.stock_open,
  fiftytwo_week_high: stock.fiftytwo_week_high,
  fiftytwo_week_low: stock.fiftytwo_week_low,
});

stockRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    StockService.getAllStocks(knexInstance)
      .then((stocks) => {
        res.json(stocks.map(serializeStock));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      stock_symbol,
      stock_name,
      stock_open,
      stock_close,
      stock_percent_change,
      stock_previous_close,
      stock_volume,
      fiftytwo_week_high,
      fiftytwo_week_low,
    } = req.body;
    const newStock = {
      stock_symbol,
      stock_name,
      stock_open,
      stock_close,
      stock_percent_change,
      stock_previous_close,
      stock_volume,
      fiftytwo_week_high,
      fiftytwo_week_low,
    };

    for (const [key, value] of Object.entries(newStock)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }

    StockService.insertStock(req.app.get("db"), newStock)
      .then((stock) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${stock.stock_symbol}`))
          .json(serializeStock(stock));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    StockService.clearAllStocks(knexInstance).then((numRowsAffected) => {
      res.status(204).end();
    });
  });

stockRouter
  .route("/:stock_symbol")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    StockService.getBySymbol(knexInstance, req.params.stock_symbol)
      .then((stock) => {
        if (stock.length === 0) {
          return res.status(404).json({
            error: { message: `Stock doesn't exist` },
          });
        } else {
          res.json(stock.map(serializeStock));
        }
      })

      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    StockService.deleteStock(knexInstance, req.params.stock_symbol)
      .then((numRowsAffected) => {
        if (!numRowsAffected) {
          return res.status(404).json({
            error: { message: `Stock doesn't exist` },
          });
        } else {
          return res.status(204).end();
        }
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      stock_symbol,
      stock_name,
      stock_open,
      stock_close,
      stock_percent_change,
      stock_previous_close,
      stock_volume,
      fiftytwo_week_high,
      fiftytwo_week_low,
    } = req.body;
    const newStock = {
      stock_symbol,
      stock_name,
      stock_open,
      stock_close,
      stock_percent_change,
      stock_previous_close,
      stock_volume,
      fiftytwo_week_high,
      fiftytwo_week_low,
    };

    const numberOfValues =
      Object.values(articleToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either the required fields`,
        },
      });
    }

    StockService.updateStock(
      req.app.get("db"),
      req.params.stock_symbol,
      newStock
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });
  
module.exports = stockRouter;
