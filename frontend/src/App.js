import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid'
import Header from './components/Header';
import CourseSelectionList from './components/CourseSelectionList';
import CourseContents from './components/CourseContents';
import AdminCourseSelectionList from './components/AdminCourseSelectionList';
import AdminCourseContents from './components/AdminCourseContents';


const App = () => {
  const [programState, setProgramState] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:3001/courses')
      .then((response) => {
        const newProgramState = {};
        newProgramState.activeCourse = 0;
        newProgramState.showAnswers = false;
        newProgramState.admin = false;
        newProgramState.courses = response.data.map((course) => ({
          ...course,
          questions: course.questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) => ({
              ...answer,
              isChecked: false,
              id: uuid()
            })),
            id: uuid()
          })),
          id: uuid()
        }));
        setProgramState(newProgramState);
      }
    );                  
  }, []);

  // Functionality to change courses based on clicks
  const handleCourseSelection = (courseIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.activeCourse = courseIndex;
    newProgramState.showAnswers = false;
    setProgramState(newProgramState);
  }

  // Functionality to handle checkbox selection functionality for user answers
  const handleAnswerSelection = (courseIndex, questionIndex) => (answerIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].isChecked = 
      !newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].isChecked;
    setProgramState(newProgramState);
  }

  // Functionality to finish answering and move to check for correctness
  const handleFinishAnswering = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.showAnswers = true;
    setProgramState(newProgramState);
  }

  // Switch between user and admin modes
  const handleAdminClick = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.admin = !programState.admin;
    setProgramState(newProgramState);
  }

  // Add a course *ADMIN*
  const handleCourseAddition = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    const newCourse = {
      courseName: "",
      questions: []
    };
    newCourse.id = uuid();
    newProgramState.courses = newProgramState.courses.concat(newCourse);
    setProgramState(newProgramState);
  }

  // Remove a course *ADMIN*
  const handleCourseDeletion = (courseIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses.splice(courseIndex, 1);
    setProgramState(newProgramState);
  }

  // Add question from a course *ADMIN*
  const handleQuestionAdding = (courseIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    const newQuestion = {
      questionString: "",
      answers: []
    };
    newQuestion.id = uuid();
    newProgramState.courses[courseIndex].questions = newProgramState.courses[courseIndex].questions.concat(newQuestion);
    setProgramState(newProgramState);
  }

  // Remove question from a course *ADMIN*
  const handleQuestionDeletion = (courseIndex, questionIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions.splice(questionIndex, 1);
    setProgramState(newProgramState);
  }

  // Add an answer to a question *ADMIN*
  const handleAnswerAdding = (courseIndex, questionIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    const newAnswer = {
      answerString: "",
      isCorrectAnswer: false,
      isChecked: false
    };
    newAnswer.id = uuid();
    newProgramState.courses[courseIndex].questions[questionIndex].answers =
      newProgramState.courses[courseIndex].questions[questionIndex].answers.concat(newAnswer);
    setProgramState(newProgramState);
  }

  // Delete an answer from a question *ADMIN*
  const handleAnswerDeletion = (courseIndex, questionIndex) => (answerIndex) => async () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].answers.splice(answerIndex, 1);
    setProgramState(newProgramState);
    await axios.delete(`http://localhost:3001/courses/${courseIndex}/questions/${questionIndex}/answers/${answerIndex}`);
  }

  // Toggle the state of an answer's correctness *ADMIN*
  const handleAnswerCorrectnessSetting = (courseIndex, questionIndex) => (answerIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].isCorrectAnswer = 
      !newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].isCorrectAnswer;
    setProgramState(newProgramState);
  }

  // Allows modification of a course's name *ADMIN*
  const handleCourseNameChange = (courseIndex) => (event) => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].courseName = event.target.value;
    setProgramState(newProgramState);
  }

  // Allows modification of question's contents *ADMIN*
  const handleQuestionStringChange = (courseIndex, questionIndex) => (event) => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].questionString = event.target.value;
    setProgramState(newProgramState);
  }

  // Allows modification of answer's string *ADMIN*
  const handleAnswerStringChange = (courseIndex, questionIndex) => (answerIndex) => (event) => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].answerString = event.target.value;
    setProgramState(newProgramState);
  }

  if (programState.admin) {
    return (
      <div className="App">
        <Header adminMode={programState.admin} handleAdminClick={handleAdminClick}/>
        <main className="mainContent">
          {programState.courses &&
          <>
            <AdminCourseSelectionList 
              courses={programState.courses}
              handleCourseSelection={handleCourseSelection}
              handleCourseNameChange={handleCourseNameChange}
              handleCourseAddition={handleCourseAddition}
              handleCourseDeletion={handleCourseDeletion}
            />
            <AdminCourseContents
              course={programState.courses[programState.activeCourse]}
              activeCourse={programState.activeCourse}
              handleAnswerAdding={handleAnswerAdding}
              handleAnswerDeletion={handleAnswerDeletion}
              handleQuestionAdding={handleQuestionAdding}
              handleQuestionDeletion={handleQuestionDeletion}
              handleAnswerCorrectnessSetting={handleAnswerCorrectnessSetting}
              handleQuestionStringChange={handleQuestionStringChange}
              handleAnswerStringChange={handleAnswerStringChange}
            />
          </>}
        </main>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Header adminMode={programState.admin} handleAdminClick={handleAdminClick}/>
        <main className="mainContent">
          {programState.courses &&
          <>
            <CourseSelectionList 
              courses={programState.courses}
              handleCourseSelection={handleCourseSelection}
            />
            <CourseContents
              course={programState.courses[programState.activeCourse]}
              activeCourse={programState.activeCourse}
              showAnswers={programState.showAnswers}
              handleAnswerSelection={handleAnswerSelection}
              handleFinishAnswering={handleFinishAnswering}
            />
          </>}
        </main>
      </div>
    );
  }
}

export default App;
