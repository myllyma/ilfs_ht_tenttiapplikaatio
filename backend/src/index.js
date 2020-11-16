const lowdb = require('lowdb');
const express = require('express');
const FileSync = require('lowdb/adapters/FileSync')

const server = express();
const adapter = new FileSync("db.json");
const db = lowdb(adapter);

console.log(db.get("courses[0]").get("questions").value());
  
server.get("/api/courses/:courseIndex/questions/:questionIndex/answers/:answerIndex", (req, res) => {
  const courseIndex = req.params.courseIndex;
  const questionIndex = req.params.questionIndex;
  const answerIndex = req.params.answerIndex;
  console.log(`Received a call to courses[${courseIndex}].questions[${questionIndex}].answers[${answerIndex}]`);

  res.json({answer:"hello"});
})

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
