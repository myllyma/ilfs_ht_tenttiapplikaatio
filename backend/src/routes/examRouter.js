const examRouter = require("express").Router();
const db = require("../utils/pgdb");
const constructExamObject = require("../utils/utility");

// Get an individual exam's contents by id.
examRouter.get("/exam/getspecific/:examId", async (req, res, next) => {
  const queryString = `
    SELECT  course.id as courseid, exam.id as examid, question.id as questionid, answer.id as answerid, 
            exam.name as examname, question.question_text as questionstring, question.subject as subject, 
            answer.answer_text as answerstring, answer.is_answer_correct as isAnswerCorrect
    FROM answer
    FULL JOIN question ON answer.question_id = question.id
    FULL JOIN exam ON question.exam_id = exam.id
    FULL JOIN course ON exam.course_id = course.id
    WHERE exam.id = $1
    ORDER BY courseid, examid, answerid;
  `;
  const parameters = [req.params.examId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database search error."});
  }

  if (result.rowCount === 0) {
    return next({type: "NoContent", errorText: "Exam by given ID does not exist."});
  }

  const examObject = constructExamObject(result.rows);
  return res.status(200).json(examObject);
});

// Get a list of exams permitted for the user.
examRouter.get("/exam/permittedexams", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, exam.name as examName
    FROM exam;
  `;
  const parameters = [];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database search error."});
  }

  if (result.rowCount === 0) {
    return next({type: "NoContent", errorText: "Exam by given ID does not exist."});
  }

  const permittedExams = result.rows;
  return res.status(200).json(permittedExams);
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
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "DatabaseError", errorText: "Failed to add a new exam to database."})
  }

  const responseObject = {
    id: result.rows[0].id,
    courseId: req.body.courseId,
    name: "",
    questions: []
  }
  return res.status(200).json(responseObject);
});

// Delete an exam
examRouter.delete("/exam/:examId", async (req, res, next) => {
  if (!("examId" in req.params)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing examId from message parameters."});
  }
  if (typeof req.params.examId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, examId is of incorrect type."});
  }

  const queryString = `
    DELETE FROM public.exam
    WHERE exam.id = $1
  `;
  const parameters = [req.params.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database error."});
    } else {
      return res.status(200).end();
    }
  });
});

// Set exam name
examRouter.put("/exam/name", async (req, res, next) => {
  if (!("examId" in req.body) || !("newExamName" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing examId or newExamName from message body."});
  }
  if (typeof req.body.examId !== "string" || typeof req.body.newExamName !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, examId or newExamName is of incorrect type."});
  }

  const queryString = `
    UPDATE public.exam
    SET name = $1
    WHERE id = $2
    RETURNING name;
  `;
  const parameters = [req.body.newExamName, req.body.examId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error during login."});
  }

  if (result.rowCount === 0) {
    return next({type: "DatabaseError", content: "Failed to modify an exam's name."});
  }

  const responseObject = {
    name: result.rows[0].name
  }
  return res.status(200).json(responseObject);
});

module.exports = examRouter;