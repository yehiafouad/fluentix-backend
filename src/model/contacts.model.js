const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    age: {
      type: String,
      trim: true,
      required: true,
    },
    work: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    writeConcern: true,
    timestamps: true,
    validateBeforeSave: true
  }
);

const Contacts = mongoose.model("Contacts", contactSchema);

module.exports = Contacts;
