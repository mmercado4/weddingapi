const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    author: String,
    message: String,
    created_at: Date,
  },
  { versionKey: false }
);

module.exports = mongoose.model("Message", messageSchema);
