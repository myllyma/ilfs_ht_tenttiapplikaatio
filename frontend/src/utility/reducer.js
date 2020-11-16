import uuid from 'react-uuid'

const reducer = (state, action) => {
  const newProgramState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case "SWITCH_COURSE":
      newProgramState.activeCourse = action.courseIndex;
      newProgramState.showAnswers = false;
      return(newProgramState);

    case "USER_TOGGLES_ANSWER":
      newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers[action.answerIndex].isChecked = 
        !newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers[action.answerIndex].isChecked;
      return(newProgramState);

    case "USER_TOGGLES_DONE_WITH_ANSWERING":
      newProgramState.showAnswers = true;
      return(newProgramState);

    case "TOGGLE_ADMIN":
      newProgramState.admin = !state.admin;
      return(newProgramState);

    case "ADD_COURSE":
      const newCourse = {
        courseName: "",
        questions: []
      };
      newProgramState.courses = newProgramState.courses.concat(newCourse);
      newCourse.id = uuid();
      return(newProgramState);

    case "ADD_QUESTION":
      const newQuestion = {
        questionString: "",
        answers: []
      };
      newQuestion.id = uuid();
      newProgramState.courses[action.courseIndex].questions = 
        newProgramState.courses[action.courseIndex].questions.concat(newQuestion);
      return(newProgramState);

    case "ADD_ANSWER":
      const newAnswer = {
        answerString: "",
        isCorrectAnswer: false,
        isChecked: false
      };
      newAnswer.id = uuid();
      newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers = 
        newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers.concat(newAnswer);
      return(newProgramState);

    case "DELETE_COURSE":
      newProgramState.courses.splice(action.courseIndex, 1);
      return(newProgramState);

    case "DELETE_QUESTION":
      newProgramState.courses[action.courseIndex].questions.splice(action.questionIndex, 1);
      return(newProgramState);

    case "DELETE_ANSWER":
      newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers.splice(action.answerIndex, 1);
      return(newProgramState);

    case "TOGGLE_ANSWER_CORRECTNESS":
      newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers[action.answerIndex].isCorrectAnswer = 
        !newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers[action.answerIndex].isCorrectAnswer;
      return(newProgramState);

    case "INPUT_COURSE_NAME":
      newProgramState.courses[action.courseIndex].courseName = action.newCourseNameString;
      return(newProgramState);

    case "INPUT_QUESTION_CONTENT":
      newProgramState.courses[action.courseIndex].questions[action.questionIndex].questionString = action.newQuestionString;
      return(newProgramState);

    case "INPUT_ANSWER_CONTENT":
      newProgramState.courses[action.courseIndex].questions[action.questionIndex].answers[action.answerIndex].answerString = action.newAnswerString;
      return(newProgramState);

    case "INIT":
      return(action.payload);

    default:
      console.log("ERROR, reducer defaulted");
  }
}

export default reducer;