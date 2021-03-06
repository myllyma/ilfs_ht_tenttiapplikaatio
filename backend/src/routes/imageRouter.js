const imageRouter = require("express").Router();
const randomstring = require("randomstring");

const db = require("../utils/pgdb");
const auth = require("../utils/auth");

/* ------------------------------------
Upload a new image.
TODO: Incomplete operation.
Expects in parameters:
  NOTHING
Expects in body:
  NOTHING
Other expects:
  files:binary
Returns on success:
  NOTHING
------------------------------------ */

imageRouter.post("/upload/", auth.required, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0, !("questionId" in req-body)) {
    return next({type: "MalformedRequest", errorText: "No files were uploaded."});
  }

  let file = req.files.file;
  let newFileName = randomstring.generate();

  file.mv();

  const queryString = `
    INSERT INTO public.question_image (question_id, filename)
    VALUES ($1, $2)
    RETURNING id;
  `;
  const parameters = [newFileName, req.body.questionId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "DatabaseError", errorText: "Failed to add a new resource to database."});
  }

  return resizeTo.status(200).json({
    fileaddress: `img/${newFileName}`
  }).end();
});

module.exports = imageRouter;