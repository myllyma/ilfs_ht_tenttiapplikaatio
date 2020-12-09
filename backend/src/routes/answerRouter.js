const answerRouter = require("express").Router();
const db = require("../utils/pgdb");

// Post a new answer
answerRouter.post("/answer/", async (req, res, next) => {
  if (!("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing questionId from message params."});
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
      return next({type: "DatabaseAddFail", errorText: "Failed to add a new question to database."})
    } else {
      const responseObject = {
        id: result.rows[0].id, 
        questionId: req.body.questionId,
        answerString: "", 
        isAnswerCorrect: false,
        isChecked: false
      }
      return res.status(200).json(responseObject);
    }
  });
});

// Delete an answer
answerRouter.delete("/answer/:answerId", async (req, res, next) => {
  if (!("answerId" in req.params)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing answerId from message body."});
  }
  if (typeof req.params.answerId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, answerId is of incorrect type."});
  }

  const queryString = `
    DELETE FROM public.answer
    WHERE answer.id = $1
  `;
  const parameters = [req.params.answerId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else {
      return res.status(200).end();
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
    WHERE id = $2
    RETURNING answer_text;
  `;
  const parameters = [req.body.newAnswerString, req.body.answerId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseAddFail", content: "Failed to modify an answer's display string."})
    } else {
      return res.status(200).json({answerString: result.rows[0].answer_text});
    }
  });
});

// Invert answer truth state
answerRouter.put("/answer/toggleiscorrect", async (req, res, next) => {
  if (!("answerId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing answerId from message body."});
  }
  if (typeof req.body.answerId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, answerId is of incorrect type."});
  }

  const queryString = `
    UPDATE public.answer
    SET is_answer_correct = NOT is_answer_correct
    WHERE id = $1
    RETURNING is_answer_correct;
  `;
  const parameters = [req.body.answerId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseAddFail", content: "Failed to modify an answer's display string."})
    } else {
      return res.status(200).json({isAnswerCorrect: result.rows[0].is_answer_correct});
    }
  });
});

module.exports = answerRouter;