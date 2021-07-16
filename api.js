const { apiInit } = require("./src/config/apiConfig");
const { dbInit } = require("./src/config/dbConfig");
const { sanitizeString } = require("./src/tools/sanitize");
const { SEED_AUTH } = require("./src/tools/constants"); //TODO Hide SEED AUTH
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

api.get("/api/messages/page/:page/amount/:amount", (request, response) => {
  let { page, amount } = request.params;
  let skip = (page - 1) * amount;
  Messages.find((error, data) => {
    if (error) console.error(error);
    else response.send(data);
  })
    .skip(skip)
    .limit(parseInt(amount));
});

//Guests
const Guests = require("./src/models/guest");

//Get guest for name and surname
api.get("/api/guests/name/:name/surname/:surname", (request, response) => {
  const { name, surname } = request.params;
  Guests.find({ name: name, surname: surname }, (error, data) => {
    if (error) console.log(error);
    else response.send(data);
  });
});

//Get all guest
api.get("/api/guests", (request, response) => {
  Guests.find((error, data) => {
    if (error) console.error(error);
    else response.send(data);
  });
});

//Get guest pages
api.get("/api/guests/page/:page/amount/:amount", (request, response) => {
  let { page, amount } = request.params;
  let skip = (page - 1) * amount;
  Guests.find((error, data) => {
    if (error) console.error(error);
    else response.send(data);
  })
    .skip(skip)
    .limit(parseInt(amount));
});

//Post guest
api.post("/api/guests", (request, response) => {
  const { name, surname, bus } = request.body;
  const newGuest = new Guests({
    name: sanitizeString(name).trim().toLowerCase(),
    surname: sanitizeString(surname).trim().toLowerCase(),
    bus: bus,
  });

  newGuest.save((error) => {
    if (error) console.error(error);
    else {
      response.status(200).send({
        success: true,
        log: "guest was inserted successfully",
        name: newGuest.name,
        surname: newGuest.surname,
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
