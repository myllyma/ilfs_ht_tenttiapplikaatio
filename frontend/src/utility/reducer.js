import uuid from 'react-uuid'

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
      const newExam = {
        examName: "",
        questions: [],
        id: action.examId
      };
      newProgramState.exams = newProgramState.exams.concat(newExam);
      newExam.id = uuid();
      return(newProgramState);

    case "DELETE_EXAM":
      newProgramState.exams.splice(action.examIndex, 1);
      return(newProgramState);

    case "INPUT_EXAM_NAME":
      newProgramState.exams[action.examIndex].examName = action.newExamNameString;
      return(newProgramState);


    // Question operations
    case "ADD_QUESTION":
      const newQuestion = {
        questionString: "",
        answers: []
      };
      newQuestion.id = uuid();
      newProgramState.exams[action.examIndex].questions = 
        newProgramState.exams[action.examIndex].questions.concat(newQuestion);
      return(newProgramState);

    case "DELETE_QUESTION":
      newProgramState.exams[action.examIndex].questions.splice(action.questionIndex, 1);
      return(newProgramState);
    
    case "INPUT_QUESTION_CONTENT":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].questionString = action.newQuestionString;
      return(newProgramState);

    case "INPUT_QUESTION_CATEGORY":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].category = action.newCategory;
      return(newProgramState);


    // Answer operations
    case "ADD_ANSWER":
      const newAnswer = {
        answerString: "",
        isCorrectAnswer: false,
        isChecked: false
      };
      newAnswer.id = uuid();
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers = 
        newProgramState.exams[action.examIndex].questions[action.questionIndex].answers.concat(newAnswer);
      return(newProgramState);

    case "DELETE_ANSWER":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers.splice(action.answerIndex, 1);
      return(newProgramState);

    case "TOGGLE_ANSWER_CORRECTNESS":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].isCorrectAnswer = 
        !newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].isCorrectAnswer;
      return(newProgramState);

    case "INPUT_ANSWER_CONTENT":
      newProgramState.exams[action.examIndex].questions[action.questionIndex].answers[action.answerIndex].answerString = action.newAnswerString;
      return(newProgramState);

    // Initialize state
    case "INIT":
      return(action.payload);

    default:
      return;
  }
}

export default reducer;