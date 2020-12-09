const reducer = (state, action) => {
  const newProgramState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    // Program state guidance operations
    case "SWITCH_EXAM":
      newProgramState.activeExam = action.examIndex;
      newProgramState.showAnswers = false;
      return(newProgramState);

    case "USER_TOGGLES_ANSWER":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].isChecked = 
        !newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].isChecked;
      return(newProgramState);

    case "USER_TOGGLES_DONE_WITH_ANSWERING":
      newProgramState.showAnswers = true;
      return(newProgramState);

    case "TOGGLE_ADMIN":
      newProgramState.admin = !state.admin;
      return(newProgramState);
    
    case "TOGGLE_PAGE":
      newProgramState.visiblePage = action.page;
      return(newProgramState);


    // Exam operations
    case "ADD_EXAM":
      newProgramState.exams = newProgramState.exams.concat(action.data);
      return(newProgramState);

    case "DELETE_EXAM":
      newProgramState.exams.splice(action.examIndex, 1);
      return(newProgramState);

    case "INPUT_EXAM_NAME":
      newProgramState.exams[action.examIndex].examName = action.name;
      return(newProgramState);


    // Question operations
    case "ADD_QUESTION":
      newProgramState.exams[action.examIndex].questions = 
        newProgramState.exams[action.examIndex].questions.concat(action.data);
      return(newProgramState);

    case "DELETE_QUESTION":
      newProgramState.exams[action.examIndex].questions.splice(action.questionIndex, 1);
      return(newProgramState);
    
    case "INPUT_QUESTION_CONTENT":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].questionString = action.questionString;
      return(newProgramState);

    case "INPUT_QUESTION_SUBJECT":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].subject = action.subject;
      return(newProgramState);


    // Answer operations
    case "ADD_ANSWER":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers = 
        newProgramState.exams[action.examIndex].questions[action.questionIndex].answers.concat(action.data);
      return(newProgramState);

    case "DELETE_ANSWER":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers.splice(action.answerIndex, 1);
      return(newProgramState);

    case "INPUT_ANSWER_CONTENT":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].answerString = action.answerString;
      return(newProgramState);

    case "TOGGLE_ANSWER_CORRECTNESS":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].isAnswerCorrect = action.isAnswerCorrect;
      return(newProgramState);

    // Initialize state
    case "INIT":
      return(action.payload);

    default:
      return;
  }
}

export default reducer;