require("dotenv").config();
const server = require("./server")
const httpServer = require("http").createServer(server);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
