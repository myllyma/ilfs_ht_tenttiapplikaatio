const answerRouter = require("express").Router();
const db = require("../utils/pgdb");
const auth = require("../utils/auth");
const {
  verifyPostAnswer,
  verifyDeleteAnswer,
  verifySetAnswerString,
  verifyInvertAnswerState
} = require("../verification/answerverify");

/* ------------------------------------
Post a new answer.
Expects in parameters:
  NOTHING
Expects in body:
  questionId:string
Returns on success:
  {
    id:number, 
    questionId:number,
    answerString:string, 
    isAnswerCorrect:bool,
    isChecked:bool
  }
------------------------------------ */

answerRouter.post("/answer/", auth.required, async (req, res, next) => {
  const verificationResult = verifyPostAnswer(req.body, req.params);
  if (verificationResult.error) {return next(verificationResult);}

  const queryString = `
    INSERT INTO public.answer (question_id, answer_text, is_answer_correct)
    VALUES ($1, '', false)
    RETURNING id;
  `;
  const parameters = [req.body.questionId];
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
    questionId: req.body.questionId,
    answerString: "", 
    isAnswerCorrect: false,
    isChecked: false
  });
});

/* ------------------------------------
Delete an answer.
Expects in parameters:
  answerId:number
Expects in body:
  NOTHING
Returns on success:
  NOTHING
------------------------------------ */

answerRouter.delete("/answer/:answerId", auth.required, async (req, res, next) => {
  const verificationResult = verifyPostAnswer(req.body, req.params);
  if (verificationResult.error) {return next(verificationResult);}

  const queryString = `
    DELETE FROM public.answer
    WHERE answer.id = $1
  `;
  const parameters = [req.params.answerId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", errorText: "Database error."});
  }

  return res.status(200).end();
});

/* ------------------------------------
Set answer string.
Expects in parameters:
  NOTHING
Expects in body:
  answerId:number
Returns on success:
  answerString:string
------------------------------------ */

answerRouter.put("/answer/answerstring", auth.required, async (req, res, next) => {
  const verificationResult = verifySetAnswerString(req.body, req.params);
  if (verificationResult.error) {return next(verificationResult);}

  const queryString = `
    UPDATE public.answer
    SET answer_text = $1
    WHERE id = $2
    RETURNING answer_text;
  `;
  const parameters = [req.body.newAnswerString, req.body.answerId];
  let result;

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", content: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "ResourceNotLocated", content: "Indicated resource not in database."});
  }

  return res.status(200).json({
    answerString: result.rows[0].answer_text
  });
});

/* ------------------------------------
Invert answer truth state
Expects in parameters:
  NOTHING
Expects in body:
  answerId:number
Returns on success:
  isAnswerCorrect:bool
------------------------------------ */

answerRouter.put("/answer/toggleiscorrect", auth.required, async (req, res, next) => {
  const verificationResult = verifyInvertAnswerState(req.body, req.params);
  if (verificationResult.error) {return next(verificationResult);}

  const queryString = `
    UPDATE public.answer
    SET is_answer_correct = NOT is_answer_correct
    WHERE id = $1
    RETURNING is_answer_correct;
  `;
  const parameters = [req.body.answerId];
  let result

  try {
    result = await db.query(queryString, parameters);
  } catch (err) {
    return next({type: "DatabaseError", content: "Database error."});
  }

  if (result.rowCount === 0) {
    return next({type: "ResourceNotLocated", content: "Indicated resource not in database."});
  }

  return res.status(200).json({
    isAnswerCorrect: result.rows[0].is_answer_correct
  });
});

module.exports = answerRouter;