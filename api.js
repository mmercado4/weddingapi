const { apiInit } = require("./src/config/apiConfig");
const { dbInit } = require("./src/config/dbConfig");

const api = apiInit();
const db = dbInit();

//Congratulation messages.
const Messages = require("./src/models/message");

api.get("/api/messages", (request, response) => {
  Messages.find((error, data) => {
    if (error) console.error(error);
    else response.send(data);
  });
});

api.listen(3333, () => {
  console.log("api is running in port 3333");
});
