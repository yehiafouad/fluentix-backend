const mongoose = require("mongoose");
const { mongoUri } = require("../config/index");

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () =>
      process.env.NODE_ENV !== "test" && console.log("Connected to MongoDB...")
  )
  .catch((e) => console.log(`Couldn't connect to MongoDB...`, e));

module.exports = { mongoose };
