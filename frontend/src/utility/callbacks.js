import axios from "axios";

const SERVER_URI = "http://localhost:3001";

const switchExam = (dispatch, examIndex) => () => {
  dispatch({type: "SWITCH_EXAM", examIndex});
}

const userTogglesAnswer = (dispatch, examIndex, questionIndex, answerIndex) => ()  => {
  dispatch({type: "USER_TOGGLES_ANSWER", examIndex, questionIndex, answerIndex});
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

// -----------------------------------
// Exam related callbacks
// -----------------------------------

const addExam = (dispatch) => () => {
  let response = {};
  (async () => {
    try {
      response = await axios.post(`${SERVER_URI}/api/exams/`);
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "ADD_EXAM", examId: response.data.id});
}

const deleteExam = (dispatch, examIndex) => ()  => {
  (async () => {
    let response = {};
    try {
      response = await axios.delete(`${SERVER_URI}/api/exams/${examIndex}`);
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "DELETE_EXAM", examIndex});
}

const inputExamName = (dispatch, examIndex) => (event)  => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/exams/${examIndex}/`, {newExamName: event.target.value});
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "INPUT_EXAM_NAME", newExamNameString: event.target.value, examIndex});
}

// -----------------------------------
// Question related callbacks
// -----------------------------------

const addQuestion = (dispatch, examIndex) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.post(`${SERVER_URI}/api/exams/${examIndex}/questions/`);
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "ADD_QUESTION", examIndex});
}

const deleteQuestion = (dispatch, examIndex, questionIndex) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.delete(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}`);
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "DELETE_QUESTION", examIndex, questionIndex});
}

const inputQuestionContent = (dispatch, examIndex, questionIndex) => (event) => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}`, {newQuestionString: event.target.value});
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "INPUT_QUESTION_CONTENT", newQuestionString: event.target.value, examIndex, questionIndex});
}

const inputQuestionCategory = (dispatch, examIndex, questionIndex) => (event) => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}`, {newCategory: event.target.value});
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "INPUT_QUESTION_CATEGORY", newCategory: event.target.value, examIndex, questionIndex});
}

// -----------------------------------
// Answer related callbacks
// -----------------------------------

const addAnswer = (dispatch, examIndex, questionIndex) => ()  => {
  (async () => {
    let response = {};
    try {
      await axios.post(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}/answers`);
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "ADD_ANSWER", examIndex, questionIndex});
}

const deleteAnswer = (dispatch, examIndex, questionIndex, answerIndex) => ()  => {
  (async () => {
    let response = {};
    try {
      response = await axios.delete(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}/answers/${answerIndex}`);
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "DELETE_ANSWER", examIndex, questionIndex, answerIndex});
}

const toggleAnswerCorrectness = (dispatch, examIndex, questionIndex, answerIndex, currentState) => () => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}/answers/${answerIndex}/`, {newIsCorrectAnswer: !currentState});
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "TOGGLE_ANSWER_CORRECTNESS", examIndex, questionIndex, answerIndex});
}

const inputAnswerContent = (dispatch, examIndex, questionIndex, answerIndex) => (event) => {
  (async () => {
    let response = {};
    try {
      response = await axios.put(`${SERVER_URI}/api/exams/${examIndex}/questions/${questionIndex}/answers/${answerIndex}`, {newAnswerString: event.target.value});
    } catch (error) {
      return;
    }
    console.log(response.data);
  })()

  dispatch({type: "INPUT_ANSWER_CONTENT", newAnswerString: event.target.value, examIndex, questionIndex, answerIndex});
}





export {switchExam,
        userTogglesAnswer,
        userTogglesDoneWithAnswering,
        toggleAdmin,
        togglePage,
        addExam,
        addQuestion,
        addAnswer,
        deleteExam,
        deleteQuestion,
        deleteAnswer,
        toggleAnswerCorrectness,
        inputExamName,
        inputQuestionContent,
        inputQuestionCategory,
        inputAnswerContent
      };