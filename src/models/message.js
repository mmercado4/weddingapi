const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    signature: String,
    message: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Message", messageSchema);
