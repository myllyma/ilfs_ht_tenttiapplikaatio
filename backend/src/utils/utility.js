const constructExamObject = (data) => {
  // Safety latch if there are no rows.
  if (data.length < 1) {
    return (null);
  }

  // Construct the base exam object
  const examObject = {
    id: data[0].examid, 
    name: data[0].examname, 
    courseId: data[0].courseid,
    questions: []
  };

  // Escape hatch when an exam has no questons.
  if (data.length === 1 && data[0].questionid === null) {
    return examObject;
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

module.exports = constructExamObject;