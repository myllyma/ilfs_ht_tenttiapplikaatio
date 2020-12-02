require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const router = require("./utils/router");
const middleware = require("./utils/middleware");

server.use(cors());
server.use(express.json());
server.use("/api", router);
server.use(middleware.unknownEndpoint);
server.use(middleware.errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
