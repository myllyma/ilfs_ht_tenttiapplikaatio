const reducer = (state, action) => {
  let newProgramState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    // Program state guidance operations
    case "CHANGEUSERNAME":
      newProgramState.inputUserName = action.inputUserName;
      return(newProgramState);

    case "CHANGEPASSWORD":
      newProgramState.inputPassword = action.inputPassword;
      return(newProgramState);

    case "LOGIN":
      newProgramState.inputUserName = "";
      newProgramState.inputPassword = "";
      newProgramState.user = action.user;
      return(newProgramState);
    
    case "LOGOUT":
      newProgramState.inputUserName = "";
      newProgramState.inputPassword = "";
      delete newProgramState.user;
      newProgramState.exams = [];
      newProgramState.visiblePage = "LOGIN";
      return(newProgramState);

    case "SET_EXAMS":
      newProgramState.exams = action.exams;
      return(newProgramState);

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
    
    case "SWITCH_PAGE":
      newProgramState.visiblePage = action.page;
      return(newProgramState);

    case "CHANGE_LANGUAGE":
      newProgramState.language = action.language;
      return(newProgramState);

    // Exam operations
    case "ADD_EXAM":
      newProgramState.exams = newProgramState.exams.concat(action.data);
      return(newProgramState);

    case "DELETE_EXAM":
      newProgramState.exams.splice(action.examIndex, 1);
      return(newProgramState);

    case "INPUT_EXAM_NAME":
      newProgramState.exams[action.examIndex].name = action.name;
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

    case "INIT":
      newProgramState = action.initialState;
      return(newProgramState);

    default:
      return;
  }
}

export default reducer;