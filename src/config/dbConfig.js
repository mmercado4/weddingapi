const mongoose = require("mongoose");
const { MONGO_URL } = require("../tools/constants");

const dbInit = () => {
  mongoose.connect(
    process.env.MONGO_URL,
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
