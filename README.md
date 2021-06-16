# Locksley Finance

## Summary:
Locksley-Server is a server-side build that supports a client side React web application, [Locksley Finance](https://github.com/zacharyjameson/locksley-client). Locksley-Server was deployed using Heroku.

## Method
* GET
* POST
* DELETE
* PATCH

## API URL Endpoints
* GET: /api/stocks
* GET Specific: /api/stocks/:stock_symbol
* POST: /api/stocks/:stock_symbol
* DELETE 1: /api/stocks/:stock_symbol
* DELETE ALL: /api/stocks
* PATCH: /api/stocks/:stock_symbol

## URL Params
### Required
* symbol=[valid stock ticker symbol i.e. MSFT, AAPL, TSLA, etc.]

## Technology Used: 
* PostgreSQL
* Node.js
* Express
* Heroku

## Live Version
[Locksley Finance](https://locksley.vercel.app/)

## Screenshots

### Home
![Home Page](src/images/Home.jpeg)

### Search Results
![Search](src/images/Search.jpeg)

### Wachlist
![Watchlist](src/images/Watchlist.jpeg)