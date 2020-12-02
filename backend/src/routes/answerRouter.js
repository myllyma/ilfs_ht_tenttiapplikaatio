const answerRouter = require("express").Router();
const db = require("../utils/pgdb");

// Post a new answer
answerRouter.post("/answer/", async (req, res, next) => {
  if (!("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing questionId from message body."});
  }
  if (typeof req.body.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, questionId is of incorrect type."});
  }

  const queryString = `
    INSERT INTO public.answer (question_id, answer_text, is_answer_correct)
    VALUES ($1, '', false)
    RETURNING id;
  `;
  const parameters = [req.body.questionId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", errorText: "Failed to add a new question to database."})
    } else {
      return res.json({id: result.rows[0].id, answerString: "", isCorrectAnswer: false});
    }
  });
});

// Delete an answer
answerRouter.delete("/answer/", async (req, res, next) => {
  if (!("answerId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing answerId from message body."});
  }
  if (typeof req.body.answerId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, answerId is of incorrect type."});
  }

  const queryString = `
    DELETE FROM public.answer
    WHERE answer.id = $1
  `;
  const parameters = [req.body.answerId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", errorText: "Failed to delete an answer from database."})
    } else {
      return res.json({response: "Answer deletion successful."});
    }
  });
});

// Set answer string
answerRouter.put("/answer/answerstring", async (req, res, next) => {
  if (!("newAnswerString" in req.body) || !("answerId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newAnswerString or answerId from message body."});
  }
  if (typeof req.body.newAnswerString !== "string" || typeof req.body.answerId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, newAnswerString or answerId is of incorrect type."});
  }

  const queryString = `
    UPDATE public.answer
    SET answer_text = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newAnswerString, req.body.answerId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an answer's display string."})
    } else {
      return res.json({response: "Answer's display string changed successfully."});
    }
  });
});

// Set answer truth state
answerRouter.put("/answer/iscorrect", async (req, res, next) => {
  if (!("newIsCorrectAnswer" in req.body) || !("answerId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newIsCorrectAnswer or answerId from message body."});
  }
  if (typeof req.body.newIsCorrectAnswer !== "boolean" || typeof req.body.answerId !== "string") {
    console.log(typeof req.body.newIsCorrectAnswer, typeof req.body.answerId)
    return next({type: "MalformedRequest", errorText: "Malformed request, newIsCorrectAnswer or answerId is of incorrect type."});
  }

  const queryString = `
    UPDATE public.answer
    SET is_answer_correct = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newIsCorrectAnswer, req.body.answerId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an answer's display string."})
    } else {
      return res.json({response: "Answer's display string changed successfully."});
    }
  });
});

module.exports = answerRouter;