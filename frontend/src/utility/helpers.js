const prepareExamAnswers = (exam) => {
  const preparedAnswers = exam.questions.map((question) => ({
    answers: question.answers.map((answer) => ({
      id: answer.id,
      isChecked: answer.isChecked
    })),
    id: question.id
  }))
  
  return preparedAnswers;
}

export {
  prepareExamAnswers
};
