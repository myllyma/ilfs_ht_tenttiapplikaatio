import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import UIDGenerator from 'uid-generator';
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
        newProgramState.UIDGenerator = new UIDGenerator();
        newProgramState.showAnswers = false;
        newProgramState.admin = false;
        newProgramState.courses = response.data.map((course) => ({
          ...course,
          questions: course.questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) => ({
              ...answer,
              isChecked: false,
              id: newProgramState.UIDGenerator.generateSync()
            })),
            id: newProgramState.UIDGenerator.generateSync()
          })),
          id: newProgramState.UIDGenerator.generateSync()
        }));
        setProgramState(newProgramState);
        console.log("after: newProgramState: ", newProgramState);
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
    newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].checked = 
      !newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].checked;
    setProgramState(newProgramState);
  }

  // Functionality to finish answering and move to check for correctness
  const handleFinishAnswering = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.showAnswers = true;
    setProgramState(newProgramState);
  }

  const handleAdminClick = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.admin = !programState.admin;
    setProgramState(newProgramState);
  }

  const handleCourseAddition = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    const newCourse = {
      courseName: "",
      questions: []
    };
    newCourse.id = programState.UIDGenerator.generateSync();
    newProgramState.courses.concat(newCourse);
    setProgramState(newProgramState);
  }

  const handleCourseDeletion = (courseIndex) => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses = 
      newProgramState.courses.splice(courseIndex, 1);
    setProgramState(newProgramState);
  }

  const handleQuestionAdding = (courseIndex) => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    const newQuestion = {
      questionString: "",
      answers: []
    };
    newQuestion.id = programState.UIDGenerator.generateSync();
    newProgramState.courses[courseIndex].questions.concat(newQuestion);
    setProgramState(newProgramState);
  }

  const handleQuestionDeletion = (courseIndex, questionIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions = 
      newProgramState.courses[courseIndex].questions.splice(questionIndex, 1);
    setProgramState(newProgramState);
  }

  const handleAnswerAdding = (courseIndex, questionIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    const newAnswer = {
      answerString: "",
      correctAnswer: false
    };
    newAnswer.id = programState.UIDGenerator.generateSync();
    newProgramState.courses[courseIndex].questions[questionIndex].answers.concat(newAnswer);
    setProgramState(newProgramState);
  }

  const handleAnswerDeletion = (courseIndex, questionIndex) => (answerIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].answers = 
      newProgramState.courses[courseIndex].questions[questionIndex].answers.splice(answerIndex, 1);
    setProgramState(newProgramState);
  }

  const handleAnswerCorrectnessSetting = (courseIndex, questionIndex) => (answerIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].isCorrect = 
      !newProgramState.courses[courseIndex].questions[questionIndex].answers[answerIndex].isCorrect;
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
              handleCourseAddition={handleCourseAddition}
              handleCourseDeletion={handleCourseDeletion}
            />
            <AdminCourseContents
              course={programState.courses[programState.activeCourse]}
              activeCourse={programState.activeCourse}
              showAnswers={programState.showAnswers}
              handleAnswerSelection={handleAnswerSelection}
              handleAnswerAdding={handleAnswerAdding}
              handleAnswerDeletion={handleAnswerDeletion}
              handleQuestionAdding={handleQuestionAdding}
              handleQuestionDeletion={handleQuestionDeletion}
              handleAnswerCorrectnessSetting={handleAnswerCorrectnessSetting}
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
