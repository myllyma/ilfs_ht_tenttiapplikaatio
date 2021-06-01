let CORS_ORIGINS = "";

if (process.env.NODE_ENV === "production") {
  CORS_ORIGINS = "https://fierce-beyond-04984.herokuapp.com/";
} else {
  CORS_ORIGINS = "http://localhost:3000";
}

module.exports = {
  CORS_ORIGINS
}
