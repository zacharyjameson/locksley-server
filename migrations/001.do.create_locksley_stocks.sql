CREATE TABLE locksley_stocks (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    stock_symbol TEXT NOT NULL,
    stock_name TEXT NOT NULL,
    stock_volume TEXT NOT NULL,
    stock_previous_close TEXT NOT NULL,
    stock_percent_change TEXT NOT NULL,
    stock_close TEXT NOT NULL,
    stock_open TEXT NOT NULL,
    fiftytwo_week_high TEXT NOT NULL,
    fiftytwo_week_low TEXT NOT NULL
);