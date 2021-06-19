const mongoose = require("mongoose");
const { MONGO_URL } = require("../tools/consts");

const dbInit = () => {
  mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error, response) => {
      if (error) console.error(error, "connecting database failed");
      else console.log("database conected");
    }
  );
};

module.exports = {
  dbInit: dbInit,
};
