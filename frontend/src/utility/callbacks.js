import axios from "axios";

const SERVER_URI = "http://localhost:3001";

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

const togglePage = (dispatch, page) => () => {
  dispatch({type: "TOGGLE_PAGE", page});
}

const addCourse = (dispatch) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.post(`${SERVER_URI}/api/courses/`);
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "ADD_COURSE"});
}

const addQuestion = (dispatch, courseIndex) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.post(`${SERVER_URI}/api/courses/${courseIndex}/questions/`);
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "ADD_QUESTION", courseIndex});
}

const addAnswer = (dispatch, courseIndex, questionIndex) => ()  => {
  (async () => {
    let response = {};
    try {
      await axios.post(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}/answers`);
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "ADD_ANSWER", courseIndex, questionIndex});
}

const deleteCourse = (dispatch, courseIndex) => ()  => {
  (async () => {
    let response = {};
    try {
      response = await axios.delete(`${SERVER_URI}/api/courses/${courseIndex}`);
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "DELETE_COURSE", courseIndex});
}

const deleteQuestion = (dispatch, courseIndex, questionIndex) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.delete(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}`);
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "DELETE_QUESTION", courseIndex, questionIndex});
}

const deleteAnswer = (dispatch, courseIndex, questionIndex, answerIndex) => ()  => {
  (async () => {
    let response = {};
    try {
      response = await axios.delete(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}/answers/${answerIndex}`);
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "DELETE_ANSWER", courseIndex, questionIndex, answerIndex});
}

const toggleAnswerCorrectness = (dispatch, courseIndex, questionIndex, answerIndex, currentState) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}/answers/${answerIndex}/`, {newIsCorrectAnswer: !currentState});
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }
  })()

  dispatch({type: "TOGGLE_ANSWER_CORRECTNESS", courseIndex, questionIndex, answerIndex});
}

const inputCourseName = (dispatch, courseIndex) => (event)  => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/courses/${courseIndex}/`, {newCourseName: event.target.value});
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }

    console.log("getting into here")
  })()

  dispatch({type: "INPUT_COURSE_NAME", newCourseNameString: event.target.value, courseIndex});
}

const inputQuestionContent = (dispatch, courseIndex, questionIndex) => (event) => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}`, {newQuestionString: event.target.value});
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }

    console.log("getting into here")
  })()

  dispatch({type: "INPUT_QUESTION_CONTENT", newQuestionString: event.target.value, courseIndex, questionIndex});
}

const inputQuestionCategory = (dispatch, courseIndex, questionIndex) => (event) => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}`, {newCategory: event.target.value});
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }

    console.log("getting into here")
  })()

  dispatch({type: "INPUT_QUESTION_CATEGORY", newCategory: event.target.value, courseIndex, questionIndex});
}

const inputAnswerContent = (dispatch, courseIndex, questionIndex, answerIndex) => (event) => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/courses/${courseIndex}/questions/${questionIndex}/answers/${answerIndex}`, {newAnswerString: event.target.value});
      console.log("Server response: ", response);
    } catch (error) {
      console.log("Server returned error: ", error);
    }

    console.log("getting into here")
  })()

  dispatch({type: "INPUT_ANSWER_CONTENT", newAnswerString: event.target.value, courseIndex, questionIndex, answerIndex});
}


export {switchCourse,
        userTogglesAnswer,
        userTogglesDoneWithAnswering,
        toggleAdmin,
        togglePage,
        addCourse,
        addQuestion,
        addAnswer,
        deleteCourse,
        deleteQuestion,
        deleteAnswer,
        toggleAnswerCorrectness,
        inputCourseName,
        inputQuestionContent,
        inputQuestionCategory,
        inputAnswerContent
      };