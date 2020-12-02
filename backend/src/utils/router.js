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
      next({type: "DatabaseError", errorText: "Database search error."});
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
      next({type: "DatabaseError", errorText: "Database search error."});
    } else if (result.rowCount === 0) {
      next({type: "NoContent", errorText: "Given exam table ID had no data associated with it."});
    } else {
      return res.json(result);;
    }
  });
});

// Post a new exam
router.post("/exam/", async (req, res, next) => {
  if (!("courseId" in req.body)) {
    next({type: "MalformedRequest", errorText: "Malformed request, missing courseId from message body."});
  }

  const queryString = `
    INSERT INTO public.exam (course_id, name)
    VALUES ($1, '')
    RETURNING id;
  `;
  const parameters = [req.body.courseId];

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      next({type: "DatabaseError", errorText: "Failed to add a new exam to database."})
    } else {
      return res.json({id: result.rows[0].id, name: "", });
    }
  });
});

// Delete an exam
router.delete("/exam/", async (req, res, next) => {
  if (!("examId" in req.body)) {
    next({type: "MalformedRequest", errorText: "Malformed request, missing examId from message body."});
  }

  const queryString = `
    DELETE FROM public.exam
    WHERE exam.id = $1
  `;
  const parameters = [req.body.examId];

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      next({type: "DatabaseError", errorText: "Database error."});
    } else if (result.rowCount === 0) {
      next({type: "DatabaseError", errorText: "Failed to delete an exam from database."})
    } else {
      return res.json({response: "Exam deletion successful."});
    }
  });
});

// Set exam name
router.put("/exam/", async (req, res) => {
  if (!("examId" in req.body) || !("newExamName" in req.body)) {
    next({type: "MalformedRequest", errorText: "Malformed request, missing examId or newExamName from message body."});
    return res.status(400).json({error: "missing information from request body"});
  }

  const queryString = `
    UPDATE public.exam
    SET name = $1
    WHERE id = $2;
  `;
  const parameters = [req.body.newExamName, req.body.examId];

  await pool.query(queryString, parameters, (err, result) => {
    if (err) {
      next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      next({type: "DatabaseError", content: "Failed to modify an exam's name."})
    } else {
      return res.json({response: "Exam name changed successfully."});
    }
  });
});

//---------------------------------------
// Question related routes
//---------------------------------------

// Post a new question
router.post("/question/", (req, res, next) => {
  if (!("examId" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const newQuestion = {
    questionString: "",
    answers: [],
    category: "",
    id: uuid()
  };

  const existenceTest = db.get("exams").find({id: req.body.examId}).value();
  if (existenceTest) {
    db.get("exams").find({id: req.body.examId}).get("questions").push(newQuestion).write();
    return res.json({answer: "Question addition successful", newQuestion});
  } else {
    res.status(404).end();
  }
});

// Delete a question
router.delete("/question/", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id: req.body.questionId}).value();
  if (existenceTest) {
    db.get("exams").find({id: req.body.examId}).get("questions").remove({id: req.body.questionId}).write();
    return res.json({answer:"Question deletion successful"});
  } else {
    return res.status(404).end();
  }
});

// Set question string
router.put("/question/questionstring", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body) || !("newQuestionString" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id: req.body.questionId}).value();
  if (existenceTest)  {
    db.get("exams").find({id: req.body.examId}).get("questions").find({id: req.body.questionId}).assign({questionString: req.body.newQuestionString}).write();
    return res.json({answer:"Question string changed"});
  } else {
    return response.status(404).end();
  }
});

// Set question category
router.put("/question/category", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body) || !("newCategory" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id: req.body.questionId}).value();
  if (existenceTest)  {
    db.get("exams").find({id: req.body.examId}).get("questions").find({id: req.body.questionId}).assign({category: req.body.newCategory}).write();
    return res.json({answer:"Question type changed"});
  } else {
    return response.status(404).end();
  }
});

//---------------------------------------
// Answer related routes
//---------------------------------------

// Post a new answer
router.post("/answer/", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const newAnswer = {
    answerString: "",
    isCorrectAnswer: false,
    id: uuid()
  };

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").value();
  if (existenceTest) {
    db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").push(newAnswer).write();
    return res.json({answer:"New answer posted", newAnswer});
  } else {
    return response.status(404).end();
  }
});

// Delete an answer
router.delete("/answer/", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body) || !("answerId" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").find({id:req.body.answerId}).value();
  if (existenceTest) {
    db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").remove({id: req.body.answerId}).write();
    res.json({answer:"Answer deletion successful"});
  } else {
    response.status(404).end();
  }
});

// Set answer string
router.put("/answer/answerstring", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body) || !("answerId" in req.body) || !("newAnswerString" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").find({id:req.body.answerId}).value();
  if (existenceTest) {
    db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").find({id:req.body.answerId}).assign({answerString: req.body.newAnswerString}).write();
    res.json({answer:"Truth value change successful"});
  } else {
    response.status(404).end();
  }
});

// Set answer truth state
router.put("/answer/iscorrect", (req, res, next) => {
  if (!("examId" in req.body) || !("questionId" in req.body) || !("answerId" in req.body) || !("newIsCorrectAnswer" in req.body)) {
    return res.status(400).json({error: "missing information from request body"});
  }

  const existenceTest = db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").find({id:req.body.answerId}).value();
  if (existenceTest) {
    db.get("exams").find({id: req.body.examId}).get("questions").find({id:req.body.questionId}).get("answers").find({id:req.body.answerId}).assign({isCorrectAnswer: req.body.newIsCorrectAnswer}).write();
    res.json({answer:"Truth value change successful"});
  } else {
    response.status(404).end();
  }
});

module.exports = router;