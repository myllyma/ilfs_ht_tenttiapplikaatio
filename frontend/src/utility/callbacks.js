import axios from "axios";
import {SERVER_URI} from "../utility/config"

const NEW_EXAMS_COURSE_TEMP = 1; // Scaffolding until courses properly implemented on frontend

// -----------------------------------
// User related callbacks
// -----------------------------------
const inputUserNameChange = (dispatch) => (event) => {
  dispatch({type: "CHANGEUSERNAME", inputUserName: event.target.value});
}

const inputPasswordChange = (dispatch) => (event) => {
  dispatch({type: "CHANGEPASSWORD", inputPassword: event.target.value});
}

const userLogin = (dispatch, inputUserName, inputPassword) => () => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/login/`, {
        "userName": inputUserName,
        "password": inputPassword
      });
    } catch (error) {
      return;
    }

    // Copy login data to state and clear password and username inputs from memory.
    dispatch({type: "LOGIN", user: response.data});


    let user = response.data;
    let permittedExams;

    try {
      permittedExams = await axios.get(`${SERVER_URI}/exam/permitted`, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch {
      return;
    }

    let examList = permittedExams.data.map(async (exam) => 
      await axios.get(`${SERVER_URI}/exam/${exam.examid}`, {headers: {"Authorization": `Token ${user.userToken}`}})
    );
    examList = await Promise.all(examList);
    examList = examList.map(exam => exam.data);

    dispatch({type: "SET_EXAMS", exams: examList});
    dispatch({type: "TOGGLE_PAGE", page: "EXAMS"});
    dispatch({type: "SWITCH_EXAM", examIndex: 0});

    window.localStorage.setItem("user", JSON.stringify(user))
  })();
}

const userLogOut = (dispatch) => () => {
  window.localStorage.removeItem("user");
  dispatch({type: "TOGGLE_PAGE", page: "LOGIN"});
  dispatch({type: "LOGOUT"});
}

// -----------------------------------
// Program control
// -----------------------------------

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
  window.localStorage.setItem("userLanguage",  language);
}

// -----------------------------------
// Exam related callbacks
// -----------------------------------

const addExam = (dispatch, user) => () => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/exam/`, {courseId: NEW_EXAMS_COURSE_TEMP}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "ADD_EXAM", data: response.data, user});
  })()
}

const deleteExam = (dispatch, examIndex, examId, user) => ()  => {
  (async () => {
    try {
      await axios.delete(`${SERVER_URI}/exam/${examId}`, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "DELETE_EXAM", examIndex, user});
  })();
}

const inputExamName = (dispatch, examIndex, examId, user) => (event)  => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/exam/name`, {examId, newExamName: event.target.value}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "INPUT_EXAM_NAME", examIndex, name: response.data.name, user});
  })();
}

// -----------------------------------
// Question related callbacks
// -----------------------------------

const addQuestion = (dispatch, examIndex, examId, user) => () => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/question/`, {examId}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "ADD_QUESTION", examIndex, data: response.data, user});
  })();
}

const deleteQuestion = (dispatch, examIndex, questionIndex, questionId, user) => () => {
  (async () => {
    try {
      await axios.delete(`${SERVER_URI}/question/${questionId}`, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "DELETE_QUESTION", examIndex, questionIndex, user});
  })();
}

const inputQuestionContent = (dispatch, examIndex, questionIndex, questionId, user) => (event) => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/question/questionstring`, {questionId, newQuestionString: event.target.value}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "INPUT_QUESTION_CONTENT", examIndex, questionIndex, questionString: response.data.questionString, user});
  })();
}

const inputQuestionSubject = (dispatch, examIndex, questionIndex, questionId, user) => (event) => {
  
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/question/subject`, {questionId, newSubject: event.target.value}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "INPUT_QUESTION_SUBJECT", examIndex, questionIndex, subject: response.data.subject, user});
  })();
}

// -----------------------------------
// Answer related callbacks
// -----------------------------------

const addAnswer = (dispatch, examIndex, questionIndex, questionId, user) => ()  => {
  (async () => {
    let response;
    try {
      response = await axios.post(`${SERVER_URI}/answer/`, {questionId}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "ADD_ANSWER", examIndex, questionIndex, data: response.data, user});
  })();
}

const deleteAnswer = (dispatch, examIndex, questionIndex, answerIndex, answerId, user) => ()  => {
  (async () => {
    try {
      await axios.delete(`${SERVER_URI}/answer/${answerId}`, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "DELETE_ANSWER", examIndex, questionIndex, answerIndex, user});
  })();
}

const inputAnswerString = (dispatch, examIndex, questionIndex, answerIndex, answerId, user) => (event) => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/answer/answerstring`, {answerId, newAnswerString: event.target.value}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "INPUT_ANSWER_CONTENT",  examIndex, questionIndex, answerIndex, answerString: response.data.answerString, user});
  })();
}

const toggleAnswerCorrectness = (dispatch, examIndex, questionIndex, answerIndex, answerId, user) => () => {
  (async () => {
    let response;
    try {
      response = await axios.put(`${SERVER_URI}/answer/toggleiscorrect/`, {answerId}, {headers: {"Authorization": `Token ${user.userToken}`}});
    } catch (error) {
      return;
    }
    dispatch({type: "TOGGLE_ANSWER_CORRECTNESS", examIndex, questionIndex, answerIndex, isAnswerCorrect: response.data.isAnswerCorrect, user});
  })();
}

export {
  inputUserNameChange,
  inputPasswordChange,
  userLogin,
  userLogOut,
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