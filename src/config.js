module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://ftnnnnxdgyceiq:9e873b6cf7502269311d5996270faeef7115cbe02ae87042d87d16246963f77f@ec2-3-233-7-12.compute-1.amazonaws.com:5432/dc2nglcvmupug4",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://zacharyjameson@localhost/locksley-test",
};
