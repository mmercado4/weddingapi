const APIPORT = 3333;
const HOST = "localhost";
const FULLHOST = "http://localhost:";
const WEB_DEV_PORT = 3434;
const WEB_URL =
  process.env.NODE_ENV === "production"
    ? "https://marinaycarlos.herokuapp.com/"
    : `${FULLHOST}${WEB_DEV_PORT}`;

module.exports = {
  APIPORT: APIPORT,
  HOST: HOST,
  FULLHOST: FULLHOST,
  WEB_URL: WEB_URL,
};
