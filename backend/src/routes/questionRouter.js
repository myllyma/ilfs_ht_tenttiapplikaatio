const questionRouter = require("express").Router();
const db = require("../utils/pgdb");
const auth = require("../utils/auth");

/* ------------------------------------
Post a new question
Expects in parameters:
  NOTHING
Expects in body:
  examId:number
Returns on success:
  id:number
  examId:number
  questionString:string
  subject:string
  answers:[]
------------------------------------ */

questionRouter.post("/question/", auth.required, async (req, res, next) => {
  if (!("examId" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message body.", details: "" });}
  if (typeof req.body.examId !== "number") {return next({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}
  
  const queryString = `
    INSERT INTO question (exam_id, question_text, subject)
    VALUES ($1, '', '')
    RETURNING id;
  `;
  const parameters = [req.body.examId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "DatabaseError", errorText: "Failed to add a new resource to database."});
  }

  return res.status(200).json({
    id: result.rows[0].id,
    examId: req.body.examId,
    questionString: "",
    subject: "",
    answers: []
  }).end();
});

/* ------------------------------------
Delete a question
Expects in parameters:
  questionId:number
Expects in body:
  NOTHING
Returns on success:
  NOTHING
------------------------------------ */

questionRouter.delete("/question/:questionId", auth.required, async (req, res, next) => {
  if (!("questionId" in req.params)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing questionId-field from message parameters.", details: "" });}
  if (!Number(req.params.questionId)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, questionId-field is of incorrect type, number expected.", details: "" });}

  const queryString = `
    DELETE FROM public.question
    WHERE question.id = $1
  `;
  const parameters = [req.params.questionId];
  let result;

  try {
    result = db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  return res.status(200).end();
});

/* ------------------------------------
Set question string
Expects in parameters:
  NOTHING
Expects in body:
  questionId:number
  newQuestionString:string
Returns on success:
  questionString:string
------------------------------------ */

questionRouter.put("/question/questionstring", auth.required, async (req, res, next) => {
  if (!("questionId" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing questionId-field from message body.", details: "" });}
  if (typeof req.body.questionId !== "number") {return next({error: true, type: "MalformedRequest", message: "Malformed request, questionId-field is of incorrect type, number expected.", details: "" });}
  if (!("newQuestionString" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing newQuestionString-field from message body.", details: "" });}
  if (typeof req.body.newQuestionString !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, newQuestionString-field is of incorrect type, string expected.", details: "" });}

  const queryString = `
    UPDATE public.question
    SET question_text = $1
    WHERE id = $2
    RETURNING question_text;
  `;
  const parameters = [req.body.newQuestionString, req.body.questionId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "ResourceNotLocated", content: "Indicated resource not in database."});
  }

  return res.status(200).json({
    questionString: result.rows[0].question_text
  }).end();
});

/* ------------------------------------
Set question subject
Expects in parameters:
  NOTHING
Expects in body:
  questionId:number
  newSubject:string
Returns on success:
  subject:string
------------------------------------ */

questionRouter.put("/question/subject", auth.required, async (req, res, next) => {
  if (!("questionId" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing questionId-field from message body.", details: "" });}
  if (typeof req.body.questionId !== "number") {return next({error: true, type: "MalformedRequest", message: "Malformed request, questionId-field is of incorrect type, number expected.", details: "" });}
  if (!("newSubject" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing newSubject-field from message body.", details: "" });}
  if (typeof req.body.newSubject !== "string") {return next({error: true, type: "MalformedRequest", message: "Malformed request, newSubject-field is of incorrect type, string expected.", details: "" });}

  const queryString = `
    UPDATE public.question
    SET subject = $1
    WHERE id = $2
    RETURNING subject;
  `;
  const parameters = [req.body.newSubject, req.body.questionId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", content: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "ResourceNotLocated", content: "Indicated resource not in database."});
  }

  return res.status(200).json({
    subject: result.rows[0].subject
  }).end();
});

module.exports = questionRouter;