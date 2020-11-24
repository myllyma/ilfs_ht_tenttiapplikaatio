const express = require('express');
const uuid = require('react-uuid');
const lowdb = require('lowdb');
const cors = require('cors')
const FileSync = require('lowdb/adapters/FileSync');

const server = express();
server.use(cors())
server.use(express.json())
const adapter = new FileSync("db.json");
const db = lowdb(adapter);
const PORT = 3001;

// Get all courses
server.get("/api/courses/", (req, res) => {
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

  db.get(`courses`).push(newCourse).write();

  res.json(newCourse);
});

// Post a new question
server.post("/api/courses/:courseIndex/questions/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const newQuestion = {
    questionString: "",
    answers: [],
    category: "",
    id: uuid()
  };

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

  db.get(`courses[${courseIndex}].questions[${questionIndex}].answers`).push(newAnswer).write();

  res.json(newAnswer);
});

// Delete a course
server.delete("/api/courses/:courseIndex", (req, res) => {
  const courseIndex = req.params.courseIndex;

  const existenceTest = db.get(`courses[${courseIndex}]`).value();
  if (existenceTest) {
    db.get("courses").remove({id: course.id}).write();
    res.json({answer: "Course deletion successful"});
  } else {
    response.status(404).end();
  }
});

// Delete a question
server.delete("/api/courses/:courseIndex/questions/:questionIndex/", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;

  const existenceTest = db.get(`courses[${courseIndex}].questions[${questionIndex}]`).value();
  if (existenceTest) {
    db.get(`courses[${courseIndex}].questions`).remove({id: question.id}).write();
    res.json({answer:"Question deletion successful"});
  } else {
    response.status(404).end();
  }
});

// Delete an answer
server.delete("/api/courses/:courseIndex/questions/:questionIndex/answers/:answerIndex", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  const answerIndex = req.params.answerIndex;

  const existenceTest = db.get(`courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`).value();
  if (existenceTest) {
    db.get(`courses[${courseIndex}].questions[${questionIndex}].answers`).remove({id: answer.id}).write();
    res.json({answer:"Answer deletion successful"});
  } else {
    response.status(404).end();
  }
});

// Set answer truth state
server.put("/api/courses/:courseIndex/questions/:questionIndex/answers/:answerIndex/", (req, res) => {
  const newContent = req.body;
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  const answerIndex = req.params.answerIndex;

  const existenceTest = db.get(`courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`).value();
  if (existenceTest) {
    if ("newIsCorrectAnswer" in newContent) {
      db.get(`courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`).assign({isCorrectAnswer: newContent.newIsCorrectAnswer}).write();
    } else if ("newAnswerString" in newContent) {
      db.get(`courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`).assign({answerString: newContent.newAnswerString}).write();
    } else {
      console.log("ditto, no valid keys found");
    }
    
    res.json({answer:"Truth value change successful"});
  } else {
    response.status(404).end();
  }
});

// Set course name
server.put("/api/courses/:courseIndex/", (req, res) => {
  const newCourseName = req.body.newCourseName;
  const courseIndex = req.params.courseIndex;

  const existenceTest = db.get(`courses[${courseIndex}]`).value();
  if (existenceTest)  {
    db.get(`courses[${courseIndex}]`).assign({courseName: newCourseName}).write();
    res.json({answer:"Course name changed successfully"});
  } else {
    response.status(404).end();
  }
});

// Set question content
server.put("/api/courses/:courseIndex/questions/:questionIndex", (req, res) => {
  const newContent = req.body;
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;

  const existenceTest = db.get(`courses[${courseIndex}].questions[${questionIndex}]`).value();
  if (existenceTest)  {
    if ("newQuestionString" in newContent) {
      db.get(`courses[${courseIndex}].questions[${questionIndex}]`).assign({questionString: newContent.newQuestionString}).write();
    } else if ("newCategory" in newContent) {
      db.get(`courses[${courseIndex}].questions[${questionIndex}]`).assign({category: newContent.newCategory}).write();
    } else {
      console.log("ditto, no valid keys found");
    }
    
    res.json({answer:"Course name changed successfully"});
  } else {
    response.status(404).end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
