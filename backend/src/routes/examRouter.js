const examRouter = require("express").Router();
const db = require("../utils/pgdb");

const constructExamObject = (data) => {
  // Construct the base exam object
  const examObject = {
    id: data[0].examid, 
    name: data[0].examname, 
    courseId: data[0].courseid,
    questions: []
  };

  if (data.length < 1) { // Safety latch if there are no rows.
    return (null);
  }

  // Construct the questions and answers for the exam.
  data.forEach((row) => {
    const questionBeingChecked = examObject.questions.filter(question => question.id === row.questionid);
    if (questionBeingChecked.length > 0) { // Question found
      const answerBeingChecked = examObject.questions[0].answers.filter(answer => answer.id === row.answerid);
      // Answer found, this should never happen, as the same combination of exam-question-answer occurring twice 
      // on one search is never supposed to happen, assuming the query is formed correctly.
      if (answerBeingChecked.length > 0) { 
        next({type: "DatabaseError", errorText: "Database error detected on exam object formation."});
      
      // Answer not found, pushing new answer.
      } else { 
        examObject.questions.find(question => question.id === row.questionid).answers.push({
          id: row.answerid,
          questionId: row.questionid,
          answerString: row.answerstring,
          isAnswerCorrect: row.isanswercorrect,
          isChecked: false
        })
      }
    } else if (row.answerid !== null) { // Question not found, pushing new question. An answer exists for the question.
      examObject.questions.push({
        id: row.questionid,
        examId: row.examid,
        questionString: row.questionstring,
        subject: row.subject,
        answers: [{
          id: row.answerid,
          questionId: row.questionid,
          answerString: row.answerstring,
          isAnswerCorrect: row.isanswercorrect,
          isChecked: false
        }]
      });
    } else { // Question not found, pushing new question. An answer does not exist for the question.
      examObject.questions.push({
        id: row.questionid,
        examId: row.examid,
        questionString: row.questionstring,
        subject: row.subject,
        answers: []
      });
    }
  });

  return examObject;
}

// Get an individual exam by id
examRouter.get("/exam/getspecific/:examId", async (req, res, next) => {
  const queryString = `
    SELECT  course.id as courseid, exam.id as examid, question.id as questionid, answer.id as answerid, 
            exam.name as examname, question.question_text as questionstring, question.subject as subject, 
            answer.answer_text as answerstring, answer.is_answer_correct as isAnswerCorrect
    FROM answer
    FULL JOIN question ON answer.question_id = question.id
    FULL JOIN exam ON question.exam_id = exam.id
    FULL JOIN course ON exam.course_id = course.id
    WHERE exam.id = $1;
  `;
  const parameters = [req.params.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error."});
    } else if (result.rowCount === 0) {
      return next({type: "NoContent", errorText: "Exam by given ID does not exist."});
    } else {
      const examObject = constructExamObject(result.rows);
      return res.status(200).json(examObject);
    }
  });
});

examRouter.get("/exam/permittedexams", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, exam.name as examName
    FROM exam;
  `;
  const parameters = [];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error."});
    } else if (result.rowCount === 0) {
      return next({type: "NoContent", errorText: "Exam by given ID does not exist."});
    } else {
      const permittedExams = result.rows;
      return res.status(200).json(permittedExams);
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
      const responseObject = {
        id: result.rows[0].id,
        courseId: req.body.courseId,
        name: "",
        questions: []
      }
      return res.status(200).json(responseObject);
    }
  });
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
    WHERE id = $2;
  `;
  const parameters = [req.body.newExamName, req.body.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", content: "Database error."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an exam's name."})
    } else {
      return res.status(200).json({response: "Exam name changed successfully."});
    }
  });
});

module.exports = examRouter;