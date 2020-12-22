const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../utils/pgdb");

userRouter.post("/signup", async (req, res, next) => {
  if (!("userName" in req.body) || !("password" in req.body) || !("email" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing userName, password or email from message params."});
  }
  if (typeof req.body.userName !== "string" || typeof req.body.password !== "string" || typeof req.body.email !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, userName, password or email is of incorrect type."});
  }

  let queryString = `
    SELECT *
    FROM user_list
    WHERE user.name = $1
    UNION
    SELECT *
    FROM user_list
    WHERE user.email = $2
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

  const passwordHash = await bcrypt.hash(req.body.password);

  queryString = `
    INSERT INTO user_list (name, password_hash, role, email)
    VALUES ($1, $2, $3, $4);
  `;
  parameters = [req.body.userName, passwordHash, "student",req.body.email];

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error during signup."});
  }
});

userRouter.post("/login/", async (req, res, next) => {
  if (!("userName" in req.body) || !("password" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing userName or password from message params."});
  }
  if (typeof req.body.userName !== "string" || typeof req.body.password !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, userName or password is of incorrect type."});
  }

  const queryString = `
    SELECT name, password_hash, role
    FROM user_list
    WHERE user.name = $1
  `;
  const parameters = [req.body.userName];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error during login."});
  }

  if (result.rowCount === 0) {
    return next({type: "LoginError", errorText: "Login error, no username found."});
  }
  
  const match = await bcrypt.compare(req.body.password, result.rows[0].password_hash);
  if (!match) {
    return next({type: "LoginError", errorText: "Login error, incorrect password."});
  } 

  const userToken = jwt.sign({
    userName: result.rows[0].name,
    passwordHash: result.rows[0].password_hash
  }, );

  return res.status(200).json(userToken);
});

module.exports = userRouter;