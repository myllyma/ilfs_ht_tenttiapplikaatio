const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const answerRouter = require("./routes/answerRouter");
const questionRouter = require("./routes/questionRouter");
const examRouter = require("./routes/examRouter");
const middleware = require("./utils/middleware");

const server = express();
server.use(cors({origin: "http://localhost:3000", optionsSuccessStatus:200}));
server.use(express.json());
server.use("/api", userRouter);
server.use("/api", answerRouter);
server.use("/api", questionRouter);
server.use("/api", examRouter);
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

module.exports = server;