const { apiInit } = require("./src/config/apiConfig");
const { dbInit } = require("./src/config/dbConfig");
const { sanitizeString, sanitizeObject } = require("./src/tools/sanitize");
const { SEED_AUTH } = require("./src/tools/consts");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

//Users
const Users = require("./src/models/user");

//Post new User
api.post("/api/users", (request, response) => {
  bcrypt.hash(request.body.password, 12).then((hashedPassword) => {
    const newUser = new Users({
      user: request.body.user,
      password: hashedPassword,
    });
    newUser.save((error) => {
      if (error) console.log(error);
      else {
        response.send({
          success: true,
          message: "User was created successfully",
          user: newUser.user,
        });
      }
    });
  });
});

//Login
api.post("/api/login", (request, response) => {
  let { user, password } = request.body;

  Users.findOne({ user: user }, (error, data) => {
    if (error) return reponse.status(500).send("Login failed!");
    if (!data)
      return response.status(403).send({
        success: false,
        message: "User/Password was wrong",
      });
    else {
      //Check password
      let hashPassword = data.password;
      let userPassword = password;
      bcrypt.compare(userPassword, hashPassword, (error, result) => {
        if (error)
          return response.status(403).send({
            success: false,
            message: "User/Password was wrong",
          });
        else {
          if (result) {
            //Create token
            const token = jwt.sign({ user: data }, SEED_AUTH, {
              expiresIn: "1h",
            });

            response.cookie("token", token).status(200).send({
              success: true,
              message: "User logged in successfully",
            });
          } else {
            response.status(403).send({
              success: false,
              message: "User/Password was wrong",
            });
          }
        }
      });
    }
  });
});

api.listen(3333, () => {
  console.log("api is running in port 3333");
});
