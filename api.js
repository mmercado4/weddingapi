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

api.post("/api/messages", (request, response) => {
  const newMessage = new Messages({
    author: request.body.author,
    message: request.body.message,
  });

  newMessage.save((error) => {
    if (error) console.error(error);
    else {
      response.status(200).send({
        success: true,
        log: "message was inserted successfully",
        author: newMessage.author,
        message: newMessage.message,
      });
    }
  });
});

api.listen(3333, () => {
  console.log("api is running in port 3333");
});
