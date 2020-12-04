const examRouter = require("express").Router();
const db = require("../utils/pgdb");

const constructExamObject = (data) => {
  const examObject = {id: data[0].examid, examName: data[0].examName, questions: []};

  data.forEach((row) => {
    const questionBeingChecked = examObject.questions.filter(question => question.id === row.questionid);
    if (questionBeingChecked.length > 0) {
      const answerBeingChecked = examObject.questions[0].answers.filter(answer => answer.id === row.answerid);
      if (answerBeingChecked.length > 0) {
        next({type: "DatabaseError", errorText: "Database error."});
      } else { // Answer not found, pushing new answer.
        examObject.questions.find(question => question.id === row.questionid).answers.push({
          id: row.answerId,
          answerString: row.answerstring,
          isCorrectAnswer: row.iscorrectanswer,
          isChecked: false
        })
      }
    } else { // Question not found, pushing new question.
      examObject.questions.push({
        id: row.questionid,
        questionString: row.questionstring,
        answers: [{
          id: row.answerId,
          answerString: row.answerstring,
          isCorrectAnswer: row.iscorrectanswer,
          isChecked: false
        }]
      });
    }
  });

  return examObject;
}

// Get an individual exam by id
examRouter.get("/exam/getspecific/:examId", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, question.id as questionId, answer.id as answerId, exam.name as examName, question.question_text as questionString, answer.answer_text as answerString, answer.is_answer_correct as isCorrectAnswer
    FROM public.answer
    JOIN public.question ON answer.question_id = question.id
    JOIN public.exam ON question.exam_id = exam.id
    WHERE exam.id = $1;
  `;
  const parameters = [req.params.examId];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error 1."});
    } else if (result.rowCount === 0) {
      return next({type: "NoContent", errorText: "Exam by given ID does not exist."});
    } else {
      const examObject = constructExamObject(result.rows);
      return res.json(examObject);
    }
  });
});

examRouter.get("/exam/permittedexams", async (req, res, next) => {
  const queryString = `
    SELECT exam.id as examId, exam.name as examName
    FROM public.exam;
  `;
  const parameters = [];

  await db.query(queryString, parameters, (err, result) => {
    if (err) {
      return next({type: "DatabaseError", errorText: "Database search error 2."});
    } else if (result.rowCount === 0) {
      return next({type: "NoContent", errorText: "Exam by given ID does not exist."});
    } else {
      const permittedExams = result.rows;
      return res.json(permittedExams);
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
      return next({type: "DatabaseError", errorText: "Database error 3."});
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
      return next({type: "DatabaseError", errorText: "Database error 4."});
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
      return next({type: "DatabaseError", content: "Database error 5."});
    } else if (result.rowCount === 0) {
      return next({type: "DatabaseError", content: "Failed to modify an exam's name."})
    } else {
      return res.json({response: "Exam name changed successfully."});
    }
  });
});

module.exports = examRouter;