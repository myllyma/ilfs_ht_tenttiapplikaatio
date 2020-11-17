const express = require('express');
const uuid = require('react-uuid');
const lowdb = require('lowdb');
const cors = require('cors')
const FileSync = require('lowdb/adapters/FileSync');

const server = express();
server.use(cors())
const adapter = new FileSync("db.json");
const db = lowdb(adapter);
const PORT = 3001;

// Get all courses
server.get("/api/courses/", (req, res) => {
  console.log(`Received a call to courses`);

  const responseObject = db.get(`courses`).value();

  if (responseObject) {
    res.json(responseObject);
  } else {
    res.status(404).end();
  }
});

// Get an individual course
server.get("/api/courses/:courseIndex/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  console.log(`Received a GET call to courses[${courseIndex}]`);

  const responseObject = db.get(`courses[${courseIndex}]`).value();
  
  if (responseObject) {
    res.json(responseObject);
  } else {
    res.status(404).end();
  }
});

// Get all questions of a course
server.get("/api/courses/:courseIndex/questions/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  console.log(`Received a GET call to courses[${courseIndex}].questions`);

  const responseObject = db.get(`courses[${courseIndex}].questions`).value();

  if (responseObject) {
    res.json(responseObject);
  } else {
    res.status(404).end();
  }
});

// Get an individual question from a course
server.get("/api/courses/:courseIndex/questions/:questionIndex/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  console.log(`Received a GET call to courses[${courseIndex}].questions[${questionIndex}]`);

  const responseObject = db.get(`courses[${courseIndex}].questions[${questionIndex}]`).value();

  if (responseObject) {
    res.json(responseObject);
  } else {
    res.status(404).end();
  }
});

// Get all answers of a question
server.get("/api/courses/:courseIndex/questions/:questionIndex/answers/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  console.log(`Received a GET call to courses[${courseIndex}].questions[${questionIndex}].answers`);

  const responseObject = db.get(`courses[${courseIndex}].questions[${questionIndex}].answers`).value();

  if (responseObject) {
    res.json(responseObject);
  } else {
    res.status(404).end();
  }
});

// Get an individual answer of a question
server.get("/api/courses/:courseIndex/questions/:questionIndex/answers/:answerIndex", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  const answerIndex = req.params.answerIndex;
  console.log(`Received a GET call to courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`);

  const responseObject = db.get(`courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`).value();

  if (responseObject) {
    res.json(responseObject);
  } else {
    res.status(404).end();
  }
});

// Post a new course
server.post("/api/courses/", (req, res) => {
  const newCourse = {
    courseName: "",
    questions: [],
    id: uuid()
  };
  console.log(`Received a POST call to courses`);

  db.get(`courses`).push(newCourse).write();

  res.json(newCourse);
});

// Post a new question
server.post("/api/courses/:courseIndex/questions/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const newQuestion = {
    questionString: "",
    answers: [],
    id: uuid()
  };
  console.log(`Received a POST call to courses[${courseIndex}].questions`);

  db.get(`courses[${courseIndex}].questions`).push(newQuestion).write();

  res.json(newQuestion);
});

// Post a new answer
server.post("/api/courses/:courseIndex/questions/:questionIndex/answers/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  const newAnswer = {
    answerString: "",
    isCorrectAnswer: false,
    id: uuid()
  };
  console.log(`Received a POST call to courses[${courseIndex}].questions[${questionIndex}].answers`);

  db.get(`courses[${courseIndex}].questions[${questionIndex}].answers`).push(newAnswer).write();

  res.json(newAnswer);
});

// Delete a course
server.delete("/api/courses/:courseIndex", (req, res) => {
  const courseIndex = req.params.courseIndex;
  console.log(`Received a DELETE call to courses[${courseIndex}]`);

  res.json({answer:`Course deletion successful`});
});

// Delete a question
server.delete("/api/courses/:courseIndex/questions/:questionIndex/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  console.log(`Received a DELETE call to courses[${courseIndex}].questions[${questionIndex}]`);

  res.json({answer:`Question deletion successful`});
});

// Delete an answer
server.delete("/api/courses/:courseIndex/questions/:questionIndex/answers/:answerIndex", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  const answerIndex = req.params.answerIndex;
  console.log(`Received a DELETE call to courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`);

  res.json({answer:`Answer deletion successful`});
});



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
