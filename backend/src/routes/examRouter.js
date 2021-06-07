const examRouter = require("express").Router();
const db = require("../utils/pgdb");
const auth = require("../utils/auth");
const {
  constructExamObject
} = require("../utils/utility");

/* ------------------------------------
Get a list of exams permitted for the user. INCOMPLETE
TODO: Filter user ID to database values to see if user has access to the exam.
Expects in parameters:
  NOTHING
Expects in body:
  NOTHING
Returns on success:

------------------------------------ */

examRouter.get("/exam/permitted", auth.required, async (req, res, next) => {
  const userToken = jwt.decode(req.headers.authorization.split(" ")[1]);

  const queryString = `
    SELECT 
      exam.id as examId,
      exam.name as examName
    FROM exam
    ORDER BY exam.id;
  `;
  const parameters = [];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database search error."});
  }

  return res.status(200).json(result.rows).end();
});

/* ------------------------------------
Get an individual exam's contents by id.
Expects in parameters:
  examId:number
Expects in body:
  NOTHING
Returns on success:
  [
    {
      id:number,
      name:string,
      courseId:number,
      questions: [
        {
          id:number,
          examId:number,
          questionString:string,
          subject:string,
          answers: [
            {
              id:number,
              questionId:number,
              answerString:string,
              isAnswerCorrect:string,
              isChecked, bool
            }, ...
          ]
        }, ...
      ]
    }, ...
  ]
------------------------------------ */

examRouter.get("/exam/:examId", auth.required, async (req, res, next) => {
  if (!("examId" in req.params)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message params.", details: "" });}
  if (!Number(req.params.examId)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}

  const queryString = `
    SELECT  
      course.id as courseid,
      exam.id as examid,
      question.id as questionid,
      answer.id as answerid,
      exam.name as examname,
      question.question_text as questionstring,
      question.subject as subject,
      answer.answer_text as answerstring,
      answer.is_answer_correct as isAnswerCorrect
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
    ({type: "ResourceNotLocated", content: "Indicated resource not in database."});
  }

  return res.status(200).json(constructExamObject(result.rows)).end();
});

/* ------------------------------------
User submits a filled out exam. INCOMPLETE.
Expects in parameters:

Expects in body:

Returns on success:

------------------------------------ */

examRouter.post("/exam/submit", auth.required, async (req, res, next) => {

});

/* ------------------------------------
User requests correct answers to an exam. INCOMPLETE.
Expects in parameters:

Expects in body:

Returns on success:

------------------------------------ */

examRouter.get("/exam/requestanswers", auth.required, async (req, res, next) => {

});

/* ------------------------------------
Post a new exam.
Expects in parameters:
  NOTHING
Expects in body:
  courseId:number
Returns on success:
  {
    id:number,
    courseId:number,
    name:string,
    questions:array
  }
------------------------------------ */

examRouter.post("/exam/", auth.required, async (req, res, next) => {
  if (!("courseId" in req.body)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing courseId-field from message body.", details: "" });}
  if (typeof req.body.courseId !== "number") {return next({error: true, type: "MalformedRequest", message: "Malformed request, courseId-field is of incorrect type, number expected.", details: "" });}

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
    return next({type: "DatabaseError", errorText: "Failed to add a new resource to database."});
  }

  return res.status(200).json({
    id: result.rows[0].id,
    courseId: req.body.courseId,
    name: "",
    questions: []
  }).end();
});

/* ------------------------------------
Admin deletes an exam.
Expects in parameters:
  examId:number
Expects in body:
  NOTHING
Returns on success:
  NOTHING
------------------------------------ */

examRouter.delete("/exam/:examId", auth.required, async (req, res, next) => {
  if (!("examId" in params)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message params.", details: "" });}
  if (!Number(req.params.examId)) {return next({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}

  const queryString = `
    DELETE FROM public.exam
    WHERE exam.id = $1
  `;
  const parameters = [req.params.examId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  return res.status(200).end();
});

/* ------------------------------------
Admin sets an exams name.
Expects in parameters:
  NOTHING
Expects in body:
  examId:int
  newExamName:string
Returns on success:
  name:string
------------------------------------ */

examRouter.put("/exam/name", auth.required, async (req, res, next) => {
  if (!("examId" in req.body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message body.", details: "" });}
  if (typeof req.body.examId !== "string") {return ({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}
  if (!("newExamName" in req.body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing newExamName-field from message body.", details: "" });}
  if (typeof req.body.newExamName !== "string") {return ({error: true, type: "MalformedRequest", message: "Malformed request, newExamName-field is of incorrect type, string expected.", details: "" });}

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
    return next({type: "ResourceNotLocated", content: "Indicated resource not in database."});
  }

  return res.status(200).json({
    name: result.rows[0].name
  }).end();
});

module.exports = examRouter;