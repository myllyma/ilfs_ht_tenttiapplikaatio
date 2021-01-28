const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const answerRouter = require("./routes/answerRouter");
const questionRouter = require("./routes/questionRouter");
const examRouter = require("./routes/examRouter");
const middleware = require("./utils/middleware");

let SERVER_URI = "";
switch (process.env.NODE_ENV) {
  case "production":
    SERVER_URI = "https://fierce-beyond-04984.herokuapp.com/";
    break;
  case "development":
    SERVER_URI = "http://localhost:3000";
    break;
  default:
}

console.log("SERVER_URI: ", SERVER_URI);

const server = express();
server.use(cors({origin: SERVER_URI, optionsSuccessStatus:200}));
server.use(express.json());
server.use(morgan("dev"));
!process.env.HEROKU && server.use(express.static("build"));
server.use("/api", userRouter);
server.use("/api", answerRouter);
server.use("/api", questionRouter);
server.use("/api", examRouter);
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

module.exports = server;