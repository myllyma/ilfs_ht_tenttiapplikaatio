const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {CORS_ORIGINS} = require("./utils/config");

const userRouter = require("./routes/userRouter");
const answerRouter = require("./routes/answerRouter");
const questionRouter = require("./routes/questionRouter");
const examRouter = require("./routes/examRouter");
const middleware = require("./utils/middleware");
const imageRouter = require("./routes/imageRouter");

const server = express();
server.use(cors({origin: CORS_ORIGINS, optionsSuccessStatus:200}));
server.use(express.json());
server.use(morgan("dev"));

server.use("/", express.static("build"));

server.use("/api", userRouter);
server.use("/api", answerRouter);
server.use("/api", questionRouter);
server.use("/api", examRouter);
server.use("/api", imageRouter);

server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

module.exports = server;