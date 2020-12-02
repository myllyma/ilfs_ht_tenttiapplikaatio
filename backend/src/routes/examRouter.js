const examRouter = require("express").Router();
const db = require("../utils/pgdb");

// Get all exams
examRouter.get("/exam/", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, question.id as questionId, answer.id as answerId, exam.name as examName, question.question_text as questionString, answer.answer_text as answerString
    FROM public.answer
    LEFT OUTER JOIN public.question ON answer.question_id = question.id
    LEFT OUTER JOIN public.exam ON question.exam_id = exam.id;
  `;
  const parameters = [];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error."});
    } else {


      return res.json(result.rows);;
    }
  });
});

// Get an individual exam by id
examRouter.get("/exam/:examId", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, question.id as questionId, answer.id as answerId, exam.name as examName, question.question_text as questionString, answer.answer_text as answerString
    FROM public.answer
    LEFT OUTER JOIN public.question ON answer.question_id = question.id
    LEFT OUTER JOIN public.exam ON question.exam_id = exam.id
    WHERE exam.id = $1;
  `;
  const parameters = [req.params.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error."});
    } else if (result.rowCount === 0) {
      return next({type: "NoContent", errorText: "Given exam table ID had no data associated with it."});
    } else {
      return res.json(result.rows);;
    }
  });
});

// Post a new exam
examRouter.post("/exam/", async (req, res, next) => {
  if (!("courseId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing courseId from message body."});
  }
  if (typeof req.body.courseId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, courseId is of incorrect type."});
  }

  const queryString = `
    INSERT INTO public.exam (course_id, name)
    VALUES ($1, '')
    RETURNING id;
  `;
  const parameters = [req.body.courseId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", errorText: "Failed to add a new exam to database."})
    } else {
      return res.json({id: result.rows[0].id, name: "", });
    }
  });
});

// Delete an exam
examRouter.delete("/exam/", async (req, res, next) => {
  if (!("examId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing examId from message body."});
  }
  if (typeof req.body.examId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, examId is of incorrect type."});
  }

  const queryString = `
    DELETE FROM public.exam
    WHERE exam.id = $1
  `;
  const parameters = [req.body.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", errorText: "Failed to delete an exam from database."})
    } else {
      return res.json({response: "Exam deletion successful."});
    }
  });
});

// Set exam name
examRouter.put("/exam/", async (req, res) => {
  if (!("examId" in req.body) || !("newExamName" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing examId or newExamName from message body."});
  }
  if (typeof req.body.examId !== "string" || typeof req.body.newExamName !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, examId or newExamName is of incorrect type."});
  }

  const queryString = `
    UPDATE public.exam
    SET name = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newExamName, req.body.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an exam's name."})
    } else {
      return res.json({response: "Exam name changed successfully."});
    }
  });
});

module.exports = examRouter;