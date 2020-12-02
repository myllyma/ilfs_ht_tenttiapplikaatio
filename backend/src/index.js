require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
const {router} = require("./utils/router");
server.use(cors());
server.use(express.json());
server.use("/api", router);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error:"unknown endpoint"})
}

server.use(unknownEndpoint);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
