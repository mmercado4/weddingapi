const cookieParser = require("cookie-parser");
const express = require("express");
const { WEB_URL } = require("../tools/constants");

const apiInit = () => {
  const api = express();

  //BodyParser
  api.use(express.json());
  api.use(express.urlencoded({ extended: true }));

  //Cookie Parser
  api.use(cookieParser());

  //Cors Policy
  api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", WEB_URL);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);
    next();
    api.options("*", (req, res) => {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PATCH, PUT, POST, DELETE, OPTIONS"
      );
      res.send();
    });
  });

  return api;
};

module.exports = {
  apiInit: apiInit,
};
