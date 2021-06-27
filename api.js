const { apiInit } = require("./src/config/apiConfig");
const { dbInit } = require("./src/config/dbConfig");
const { sanitizeString, sanitizeObject } = require("./src/tools/sanitize");

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
    author: sanitizeString(request.body.author),
    message: sanitizeString(request.body.message),
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

//Guests
const Guests = require("./src/models/guest");

//Get guest for email
api.get("/api/guests/email/:email", (request, response) => {
  let email = request.params.email;
  Guests.find({ email: email }, (error, data) => {
    if (error) console.log(error);
    else response.send(data);
  });
});

//Post guest
api.post("/api/guests", (request, response) => {
  const newGuest = new Guests({
    name: sanitizeString(request.body.name),
    email: sanitizeString(request.body.email),
    bus: request.body.bus,
    companions: request.body.companions,
  });

  newGuest.save((error) => {
    if (error) console.error(error);
    else {
      response.status(200).send({
        success: true,
        log: "guest was inserted successfully",
        name: newGuest.name,
        email: newGuest.email,
        bus: newGuest.bus,
      });
    }
  });
});

api.listen(3333, () => {
  console.log("api is running in port 3333");
});
