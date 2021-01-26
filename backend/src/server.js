const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const answerRouter = require("./routes/answerRouter");
const questionRouter = require("./routes/questionRouter");
const examRouter = require("./routes/examRouter");
const middleware = require("./utils/middleware");

let SERVER_URI = "";
if (process.env.HEROKU) {
  SERVER_URI = "https://fierce-beyond-04984.herokuapp.com/";
} else {
  SERVER_URI = "http://localhost:3000";
}

const server = express();
server.use(cors({origin: SERVER_URI, optionsSuccessStatus:200}));
server.use(express.json());
server.use(morgan("dev"));
server.use(express.static("build"));
server.use("/api", userRouter);
server.use("/api", answerRouter);
server.use("/api", questionRouter);
server.use("/api", examRouter);
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

module.exports = server;