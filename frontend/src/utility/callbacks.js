const switchCourse = (dispatch, courseIndex) => () => {
  dispatch({type: "SWITCH_COURSE", courseIndex});
}

const userTogglesAnswer = (dispatch, courseIndex, questionIndex, answerIndex) => ()  => {
  dispatch({type: "USER_TOGGLES_ANSWER", courseIndex, questionIndex, answerIndex});
}

const userTogglesDoneWithAnswering = (dispatch) => ()  => {
  dispatch({type: "USER_TOGGLES_DONE_WITH_ANSWERING"});
}

const toggleAdmin = (dispatch) => ()  => {
  dispatch({type: "TOGGLE_ADMIN"});
}

const addCourse = (dispatch) => () => {
  dispatch({type: "ADD_COURSE"});
}

const addQuestion = (dispatch, courseIndex) => () => {
  dispatch({type: "ADD_QUESTION", courseIndex});
}

const addAnswer = (dispatch, courseIndex, questionIndex) => ()  => {
  dispatch({type: "ADD_ANSWER", courseIndex, questionIndex});
}

const deleteCourse = (dispatch, courseIndex) => ()  => {
  dispatch({type: "DELETE_COURSE", courseIndex});
}

const deleteQuestion = (dispatch, courseIndex, questionIndex) => () => {
  dispatch({type: "DELETE_QUESTION", courseIndex, questionIndex});
}

const deleteAnswer = (dispatch, courseIndex, questionIndex, answerIndex) => ()  => {
  dispatch({type: "DELETE_ANSWER", courseIndex, questionIndex, answerIndex});
}

const toggleAnswerCorrectness = (dispatch, courseIndex, questionIndex, answerIndex) => () => {
  dispatch({type: "TOGGLE_ANSWER_CORRECTNESS", courseIndex, questionIndex, answerIndex});
}

const inputCourseName = (dispatch, courseIndex) => (event)  => {
  dispatch({type: "INPUT_QUESTION_CONTENT", newCourseNameString: event.target.value, courseIndex});
}

const inputQuestionContent = (dispatch, courseIndex, questionIndex) => (event) => {
  dispatch({type: "INPUT_QUESTION_CONTENT", newQuestionString: event.target.value, courseIndex, questionIndex});
}

const inputAnswerContent = (dispatch, courseIndex, questionIndex, answerIndex) => (event) => {
  dispatch({type: "INPUT_ANSWER_CONTENT", newAnswerString: event.target.value, courseIndex, questionIndex, answerIndex});
}


export {switchCourse,
        userTogglesAnswer,
        userTogglesDoneWithAnswering,
        toggleAdmin,
        addCourse,
        addQuestion,
        addAnswer,
        deleteCourse,
        deleteQuestion,
        deleteAnswer,
        toggleAnswerCorrectness,
        inputCourseName,
        inputQuestionContent,
        inputAnswerContent
      };