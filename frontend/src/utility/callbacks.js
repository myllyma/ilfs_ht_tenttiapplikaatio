import axios from "axios";
import {SERVER_URI} from "../utility/config"

const NEW_EXAMS_COURSE_TEMP = 1; // Scaffolding until courses properly implemented on frontend

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

const changeLanguage = (dispatch, language) => () => {
  dispatch({type: "CHANGE_LANGUAGE", language});
}

// -----------------------------------
// Exam related callbacks
// -----------------------------------

const addExam = (dispatch) => () => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/exam/`, {courseId: NEW_EXAMS_COURSE_TEMP});
    } catch (error) {
      return;
    }
    console.log("Response to addExam: ", response);
    dispatch({type: "ADD_EXAM", data: response.data});
  })()
}

const deleteExam = (dispatch, examIndex, examId) => ()  => {
  (async () => {
    let response;
    try {
      response = await axios.delete(`${SERVER_URI}/exam/${examId}`);
    } catch (error) {
      return;
    }
    console.log("Response to deleteExam: ", response);
    dispatch({type: "DELETE_EXAM", examIndex});
  })();
}

const inputExamName = (dispatch, examIndex, examId) => (event)  => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/exam/name`, {examId, newExamName: event.target.value});
    } catch (error) {
      return;
    }
    console.log("Response to inputExamName: ", response);
    dispatch({type: "INPUT_EXAM_NAME", examIndex, examNameString: response.data.name});
  })();
}

// -----------------------------------
// Question related callbacks
// -----------------------------------

const addQuestion = (dispatch, examIndex, examId) => () => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/question/`, {examId});
    } catch (error) {
      return;
    }
    console.log("Response to addQuestion: ", response);
    dispatch({type: "ADD_QUESTION", examIndex, data: response.data});
  })();
}

const deleteQuestion = (dispatch, examIndex, questionIndex, questionId) => () => {
  (async () => {
    let response;
    try {
      response = await axios.delete(`${SERVER_URI}/question/${questionId}`);
    } catch (error) {
      return;
    }
    console.log("Response to deleteQuestion: ", response);
    dispatch({type: "DELETE_QUESTION", examIndex, questionIndex});
  })();
}

const inputQuestionContent = (dispatch, examIndex, questionIndex, questionId) => (event) => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/question/questionstring`, {questionId, newQuestionString: event.target.value});
    } catch (error) {
      return;
    }
    console.log("Response to inputQuestionContent: ", response);
    dispatch({type: "INPUT_QUESTION_CONTENT", examIndex, questionIndex, questionString: response.data.questionString});
  })();
}

const inputQuestionSubject = (dispatch, examIndex, questionIndex, questionId) => (event) => {
  
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/question/subject`, {questionId, newSubject: event.target.value});
    } catch (error) {
      return;
    }
    console.log("Response to inputQuestionSubject: ", response);
    dispatch({type: "INPUT_QUESTION_SUBJECT", examIndex, questionIndex, subject: response.data.subject});
  })();
}

// -----------------------------------
// Answer related callbacks
// -----------------------------------

const addAnswer = (dispatch, examIndex, questionIndex, questionId) => ()  => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/answer/`, {questionId});
    } catch (error) {
      return;
    }
    console.log("Response to addAnswer: ", response);
    dispatch({type: "ADD_ANSWER", examIndex, questionIndex, data: response.data});
  })();
}

const deleteAnswer = (dispatch, examIndex, questionIndex, answerIndex, answerId) => ()  => {
  (async () => {
    let response;
    try {
      response = await axios.delete(`${SERVER_URI}/answer/${answerId}`);
    } catch (error) {
      return;
    }
    console.log("Response to deleteAnswer: ", response);
    dispatch({type: "DELETE_ANSWER", examIndex, questionIndex, answerIndex});
  })();
}

const inputAnswerString = (dispatch, examIndex, questionIndex, answerIndex, answerId) => (event) => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/answer/answerstring`, {answerId, newAnswerString: event.target.value});
    } catch (error) {
      return;
    }
    console.log("Response to inputAnswerString: ", response);
    dispatch({type: "INPUT_ANSWER_CONTENT",  examIndex, questionIndex, answerIndex, answerString: response.data.answerString});
  })();
}

const toggleAnswerCorrectness = (dispatch, examIndex, questionIndex, answerIndex, answerId) => () => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/answer/toggleiscorrect/`, {answerId});
    } catch (error) {
      return;
    }
    console.log("Response to toggleAnswerCorrectness: ", response);
    dispatch({type: "TOGGLE_ANSWER_CORRECTNESS", examIndex, questionIndex, answerIndex, isAnswerCorrect: response.data.isAnswerCorrect});
  })();
}

export {
  switchExam,
  userTogglesAnswer,
  userTogglesDoneWithAnswering,
  toggleAdmin,
  togglePage,
  changeLanguage,
  addExam,
  addQuestion,
  addAnswer,
  deleteExam,
  deleteQuestion,
  deleteAnswer,
  toggleAnswerCorrectness,
  inputExamName,
  inputQuestionContent,
  inputQuestionSubject,
  inputAnswerString
};