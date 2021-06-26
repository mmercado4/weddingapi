const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guestSchema = new Schema(
  {
    name: String,
    email: String,
    companions: [String],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Guest", guestSchema);
