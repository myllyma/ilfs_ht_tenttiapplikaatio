require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const userRouter = require("./routes/userRouter");
const answerRouter = require("./routes/answerRouter");
const questionRouter = require("./routes/questionRouter");
const examRouter = require("./routes/examRouter");
const middleware = require("./utils/middleware");

server.use(cors({origin: "http://localhost:3000", optionsSuccessStatus:200}));
server.use(express.json());
server.use("/api", userRouter);
server.use("/api", answerRouter);
server.use("/api", questionRouter);
server.use("/api", examRouter);
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
