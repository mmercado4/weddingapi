const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guestSchema = new Schema(
  {
    name: String,
    email: String,
    companions: Array,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Guest", guestSchema);
