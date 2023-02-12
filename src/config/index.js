module.exports = {
  mongoUri:
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_TEST
      : process.env.NODE_ENV !== "production"
      ? process.env.MONGO_DEV
      : process.env.MONGO_PROD,
};
