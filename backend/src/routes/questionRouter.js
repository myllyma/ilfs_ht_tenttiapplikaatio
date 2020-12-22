const questionRouter = require("express").Router();
const db = require("../utils/pgdb");

// Post a new question
questionRouter.post("/question/", async (req, res, next) => {
  if (!("examId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing examId from message body."});
  }
  if (typeof req.body.examId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, examId is of incorrect type."});
  }

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
    return next({type: "DatabaseError", errorText: "Failed to add a new question to database."});
  }

  const responseObject = {
    id: result.rows[0].id,
    examId: req.body.examId,
    questionString: "",
    subject: "",
    answers: []
  }
  return res.status(200).json(responseObject);
});

// Delete a question
questionRouter.delete("/question/:questionId", async (req, res, next) => {
  if (!("questionId" in req.params)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing questionId from message params."});
  }
  if (typeof req.params.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, questionId is of incorrect type."});
  }

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

// Set question string
questionRouter.put("/question/questionstring", async (req, res, next) => {
  if (!("newQuestionString" in req.body) || !("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newQuestionString or questionId from message body."});
  }
  if (typeof req.body.newQuestionString !== "string" || typeof req.body.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, newQuestionString or questionId is of incorrect type."});
  }

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
    return next({type: "DatabaseError", content: "Failed to modify an question's display string."})
  }

  const responseObject = {questionString: result.rows[0].question_text};
  return res.status(200).json(responseObject);
});

// Set question subject
questionRouter.put("/question/subject", async (req, res, next) => {
  if (!("newSubject" in req.body) || !("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newSubject or questionId from message body."});
  }
  if (typeof req.body.newSubject !== "string" || typeof req.body.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, newSubject or questionId is of incorrect type."});
  }

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
    return next({type: "DatabaseError", content: "Failed to modify an question's subject."});
  }

  const responseObject = {
    subject: result.rows[0].subject
  }
  return res.status(200).json(responseObject);
});

module.exports = questionRouter;