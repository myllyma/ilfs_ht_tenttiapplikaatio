const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../utils/pgdb");

/* ------------------------------------
Handle new user signup process.
Expects in parameters:
  NOTHING
Expects in body:
  userName:string
  password:string
  email:string
Returns on success:
  NOTHING
------------------------------------ */

userRouter.post("/signup", async (req, res, next) => {
  if (!("userName" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing userName-field from message body.", details: "" });}
  if (typeof req.body.userName !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, userName-field is of incorrect type, string expected.", details: "" });}
  if (!("password" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing password-field from message body.", details: "" });}
  if (typeof req.body.password !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, password-field is of incorrect type, string expected.", details: "" });}
  if (!("email" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing email-field from message body.", details: "" });}
  if (typeof req.body.email !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, email-field is of incorrect type, string expected.", details: "" });}

  let queryString = `
    SELECT *
    FROM user_list
    WHERE user_list.name = $1
    UNION
    SELECT *
    FROM user_list
    WHERE user_list.email = $2;
  `;
  let parameters = [req.body.userName, req.body.email];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error during signup."});
  }

  if (result.rowCount > 0) { // Checks if either the user name OR the email have already been used by someone.
    return next({type: "SignupError", errorText: "Signup error, username or email address already exists."});
  }

  const passwordHash = await bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS));

  queryString = `
    INSERT INTO user_list (name, password_hash, role, email)
    VALUES ($1, $2, $3, $4);
  `;
  parameters = [req.body.userName, passwordHash, "student", req.body.email];

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error during signup."});
  }
});

/* ------------------------------------
Handle user login.
TODO: Once front has been fixed so that it gets the necessary data from the user token, remove extra returns.
Expects in parameters:
  NOTHING
Expects in body:
  userName:string
  password:string
Returns on success:
  userToken:string
  userName:string
  role:string
------------------------------------ */

userRouter.post("/login/", async (req, res, next) => {
  if (!("userName" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing userName-field from message body.", details: "" });}
  if (typeof req.body.userName !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, userName-field is of incorrect type, string expected.", details: "" });}
  if (!("password" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing password-field from message body.", details: "" });}
  if (typeof req.body.password !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, password-field is of incorrect type, string expected.", details: "" });}

  const queryString = `
    SELECT name, password_hash, role
    FROM user_list
    WHERE user_list.name = $1
  `;
  const parameters = [req.body.userName];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error during login."});
  }

  // Check for username existing.
  if (result.rowCount === 0) {
    return next({type: "LoginError", errorText: "Login error, username or password incorrect."});
  }
  
  // Check for given password matching with the stored hash.
  const match = await bcrypt.compare(req.body.password, result.rows[0].password_hash);
  if (!match) {
    return next({type: "LoginError", errorText: "Login error, username or password incorrect."});
  }

  const userTokenObject = {
    userName: result.rows[0].name,
    role: result.rows[0].role
  };

  // Generate token for user.
  let userToken;
  try {
    userToken = jwt.sign(userTokenObject, process.env.PRIVATEKEY);
  } catch (err) {
    next({type: "LoginError", errorText: "Error signing token during login."});
  }
  
  return res.status(200).json({
    userToken,
    userName: result.rows[0].name,
    role: result.rows[0].role
  });
});

module.exports = userRouter;