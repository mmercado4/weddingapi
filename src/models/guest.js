const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guestSchema = new Schema(
  {
    name: String,
    surname: String,
    bus: Boolean,
    allergies: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Guest", guestSchema);
