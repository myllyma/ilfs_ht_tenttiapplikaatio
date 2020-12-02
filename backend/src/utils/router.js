const router = require("express").Router();


const uuid = require("react-uuid");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = lowdb(adapter);


const {Pool} = require("pg");
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
const pool = new Pool({connectionString});

//---------------------------------------
// Exam related routes
//---------------------------------------

// Get all exams
router.get("/exam/", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, question.id as questionId, answer.id as answerId, exam.name as examName, question.question_text as questionString, answer.answer_text as answerString
    FROM public.answer
    LEFT OUTER JOIN public.question ON answer.question_id = question.id
    LEFT OUTER JOIN public.exam ON question.exam_id = exam.id;
  `;
  const parameters = [];

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error."});
    } else {
      return res.json(result);;
    }
  });
});

// Get an individual exam by id
router.get("/exam/:examId", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, question.id as questionId, answer.id as answerId, exam.name as examName, question.question_text as questionString, answer.answer_text as answerString
    FROM public.answer
    LEFT OUTER JOIN public.question ON answer.question_id = question.id
    LEFT OUTER JOIN public.exam ON question.exam_id = exam.id
    WHERE exam.id = $1;
  `;
  const parameters = [req.params.examId];

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error."});
    } else if (result.rowCount === 0) {
      return next({type: "NoContent", errorText: "Given exam table ID had no data associated with it."});
    } else {
      return res.json(result);;
    }
  });
});

// Post a new exam
router.post("/exam/", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.delete("/exam/", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.put("/exam/", async (req, res) => {
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

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an exam's name."})
    } else {
      return res.json({response: "Exam name changed successfully."});
    }
  });
});

//---------------------------------------
// Question related routes
//---------------------------------------

// Post a new question
router.post("/question/", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.delete("/question/", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.put("/question/questionstring", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.put("/question/category", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an question's category."})
    } else {
      return res.json({response: "Question's category changed successfully."});
    }
  });
});

//---------------------------------------
// Answer related routes
//---------------------------------------

// Post a new answer
router.post("/answer/", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.delete("/answer/", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.put("/answer/answerstring", async (req, res, next) => {
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

  await pool.query(queryString, parameters, (err, result) => {
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
router.put("/answer/iscorrect", async (req, res, next) => {
  if (!("newIsCorrectAnswer" in req.body) || !("answerId" in req.body)) {
    return next({type: "MalformedRequest", errorText: "Malformed request, missing newIsCorrectAnswer or answerId from message body."});
  }
  if (typeof req.body.newIsCorrectAnswer !== "string" || typeof req.body.answerId !== "string") {
    return next({type: "MalformedRequest", errorText: "Malformed request, newIsCorrectAnswer or answerId is of incorrect type."});
  }

  const queryString = `
    UPDATE public.answer
    SET is_answer_correct = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newIsCorrectAnswer, req.body.answerId];

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an answer's display string."})
    } else {
      return res.json({response: "Answer's display string changed successfully."});
    }
  });
});

module.exports = router;