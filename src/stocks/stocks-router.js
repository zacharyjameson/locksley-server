const path = require("path");
const express = require("express");
const xss = require("xss");
const StockService = require("./stock-service");

const stockRouter = express.Router();
const jsonParser = express.json();

const serializeStock = (stock) => ({
  id: stock.id,
  stock_symbol: stock.stock_symbol,
  date_info: stock.date_info,
  price_open: stock.price_open,
  price_high: stock.price_high,
  price_low: stock.price_low,
  price_close: stock.price_close,
  stock_volume: stock.stock_volume,
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
        const { stock_symbol, stock_volume, date_info, price_close, price_high, price_low, price_open } = req.body;
        const newStock = { stock_symbol, stock_volume, date_info, price_close, price_high, price_low, price_open};

        for(const [key, value] of Object.entries(newStock)) {
            if(!value) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body`},
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
        .all((req, res, next) => {
            const knexInstance = req.app.get("db");
            StockService.getBySymbol(knexInstance, req.params.stock_symbol)
                .then((stock) => {
                    if(!stock){
                        return res.status(404).json({
                            error: { message: `Stock doesn't exist` },
                        });
                    }
                    res.stock = { stock };
                    next();
                })
                .catch(next);
        })
        .get((req, res, next) => {
            res.json(serializeStock(res.stock));
        })
        .delete((req, res, next) => {
            const knexInstance = req.app.get("db");
            StockService.deleteStock(knexInstance, req.params.stock_symbol)
                .then((numRowsAffected) => {
                    res.status(204).end();
                })
                .catch(next);
        })

        module.exports = stockRouter;