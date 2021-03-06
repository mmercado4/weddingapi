const { apiInit } = require("./src/config/apiConfig");
const { dbInit } = require("./src/config/dbConfig");
const { sanitizeString } = require("./src/tools/sanitize");
const { APIPORT } = require("./src/tools/constants");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Config dotenv
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const api = apiInit();
const db = dbInit();

const PORT = process.env.PORT || APIPORT;

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
    created_at: new Date(),
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

//Get messages for id
api.get("/api/messages/:id", (request, response) => {
  let { id } = request.params;
  Messages.findById(id, (error, data) => {
    if (error) response.status(500).send(error);
    else response.status(200).send(data);
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

//Delete messages
api.delete("/api/messages/:id", (request, response) => {
  let { id } = request.params;
  Messages.findByIdAndRemove(id, (error, data) => {
    if (error) return response.status(500).send(error);
    else {
      if (data) {
        response.status(200).send({
          success: true,
          method: "DELETE",
          message: "The message was delete successfully",
        });
      } else {
        response.status(200).send({
          success: true,
          method: "DELETE",
          message: "The message wasn??t found",
          id_searched: id,
        });
      }
    }
  });
});

//Update messages
api.put("/api/messages/:id", (request, response) => {
  let { id } = request.params;

  Messages.findByIdAndUpdate(id, { $set: request.body }, (error, data) => {
    if (error) response.status(500).send(error);
    else {
      response.status(201).send({
        success: true,
        message: "Message was modified successfully",
        data: data,
      });
    }
  });
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

//Get guests for id
api.get("/api/guests/:id", (request, response) => {
  let { id } = request.params;
  Guests.findById(id, (error, data) => {
    if (error) response.status(500).send(error);
    else response.status(200).send(data);
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
  const { name, surname, bus, allergies } = request.body;
  const newGuest = new Guests({
    name: sanitizeString(name).trim(),
    surname: sanitizeString(surname).trim(),
    bus: bus,
    allergies: sanitizeString(allergies).trim(),
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
        allergies: newGuest.allergies,
      });
    }
  });
});

//Delete guests
api.delete("/api/guests/:id", (request, response) => {
  let { id } = request.params;
  Guests.findByIdAndRemove(id, (error, data) => {
    if (error) return response.status(500).send(error);
    else {
      if (data) {
        response.status(200).send({
          success: true,
          method: "DELETE",
          message: "The guest was delete successfully",
        });
      } else {
        response.status(200).send({
          success: true,
          method: "DELETE",
          message: "The guest wasn??t found",
          id_searched: id,
        });
      }
    }
  });
});

//Update guest
api.put("/api/guests/:id", (request, response) => {
  let { id } = request.params;

  Guests.findByIdAndUpdate(id, { $set: request.body }, (error, data) => {
    if (error) response.status(500).send(error);
    else {
      response.status(201).send({
        success: true,
        message: "Guest was modified successfully",
        data: data,
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
            const token = jwt.sign({ user: data }, process.env.SEED_AUTH, {
              expiresIn: 50000,
            });

            response
              .cookie("token", token, { sameSite: "none", secure: true })
              .status(200)
              .send({
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

api.listen(PORT, () => {
  console.log("api is running in port 3333");
});
