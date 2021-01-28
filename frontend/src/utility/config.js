let SERVER_URI = "";

switch (process.env.NODE_ENV) {
  case "development":
    SERVER_URI = "http://localhost:3001/api";
    break;
  case "production":
    SERVER_URI = "https://fierce-beyond-04984.herokuapp.com/api";
    break;
  default:
    SERVER_URI = "http://localhost:3001/api";
}

export {
  SERVER_URI
};