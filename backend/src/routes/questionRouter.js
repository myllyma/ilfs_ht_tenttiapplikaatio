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
    INSERT INTO public.question (exam_id, question_text, subject)
    VALUES ($1, '', '')
    RETURNING id;
  `;
  const parameters = [req.body.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", errorText: "Failed to add a new question to database."})
    } else {
      return res.json({id: result.rows[0].id, questionString: "", category: ""});
    }
  });
});

// Delete a question
questionRouter.delete("/question/", async (req, res, next) => {
  if (!("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing questionId from message body."});
  }
  if (typeof req.body.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, questionId is of incorrect type."});
  }


  const queryString = `
    DELETE FROM public.question
    WHERE question.id = $1
  `;
  const parameters = [req.body.questionId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", errorText: "Failed to delete a question from database."})
    } else {
      return res.json({response: "Question deletion successful."});
    }
  });
});

// Set question string
questionRouter.put("/question/questionstring", async (req, res, next) => {
  if (!("newQuestionString" in req.body) || !("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newQuestionString or questionId from message body."});
  }
  if (typeof req.body.newQuestionString !== "string" || typeof req.body.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, newCategory or questionId is of incorrect type."});
  }

  const queryString = `
    UPDATE public.question
    SET question_text = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newQuestionString, req.body.questionId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an question's display string."})
    } else {
      return res.json({response: "Question string changed successfully."});
    }
  });
});

// Set question category
questionRouter.put("/question/category", async (req, res, next) => {
  if (!("newCategory" in req.body) || !("questionId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newCategory or questionId from message body."});
  }
  if (typeof req.body.newCategory !== "string" || typeof req.body.questionId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, newCategory or questionId is of incorrect type."});
  }

  const queryString = `
    UPDATE public.question
    SET subject = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newCategory, req.body.questionId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an question's category."})
    } else {
      return res.json({response: "Question's category changed successfully."});
    }
  });
});

module.exports = questionRouter;