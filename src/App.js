import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import UIDGenerator from 'uid-generator';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

// Display navigation header
const Header = () => {
  return (
    <header className="Header">
      <nav className="navBar">
        <div className="navBarItem">Tentit</div>
        <div className="navBarItem">Tietoa sovelluksesta</div>
        <div className="navBarItem exitButton">Poistu</div>
      </nav>
    </header>
  );
}

// Display the list of available course
const CourseSelectionList = ({courseData, programState, handleCourseSelection}) => {
  return (
    <div className="CourseSelectionList">
      {courseData.map((course, courseIndex) => 
      <Button 
        key={programState.courses[courseIndex].id} 
        color="primary" 
        className="CourseSelectionListItem" 
        onClick={handleCourseSelection(courseIndex)
      }>
        {course.courseName}
      </Button>
      )}
    </div>
  );
}

// Display an individual question
const Question = ({question, programState, showAnswers, handleAnswerSelection}) => {
  let showCorrectAnswerMark = true;
  programState.answers.forEach((userAnswer, index) => { if (userAnswer.checked !== question.answers[index].correctAnswer) {showCorrectAnswerMark = false;}});

  return(
    <Paper className="Question">
      <p>
        {question.questionString} 
        {showAnswers && showCorrectAnswerMark && <img className="dogImage" src="dog_image.png" alt="dog head"/>}
      </p>
      {question.answers.map((answer, answerIndex) => 
        <div key={programState.answers[answerIndex].id}>
          <Checkbox 
            color="primary" 
            onChange={handleAnswerSelection(answerIndex)} 
            checked={programState.answers[answerIndex].checked} 
            readOnly={true}
          />
          {showAnswers && 
            <Checkbox 
              color="secondary" 
              checked={question.answers[answerIndex].correctAnswer} 
              readOnly={true}
            />
          }
          {answer.answerString}
        </div>
      )}
    </Paper>
  );
}

// Displays the data for one course's exam
const CourseExamQuestions = ({courseData, programState, handleAnswerSelection, handleFinishAnswering}) => {
  return(
    <div className="CourseExamQuestions">
      <div className="ExamQuestions">
        {courseData[programState.activeCourse].questions.map((question, questionIndex) => {
          return(
          <Question
            key={programState.courses[programState.activeCourse].questions[questionIndex].id}
            question={question}
            programState={programState.courses[programState.activeCourse].questions[questionIndex]}
            showAnswers={programState.showAnswers}
            handleAnswerSelection={handleAnswerSelection(programState.activeCourse, questionIndex)}/>
          )
        }
        )}
      </div>
      {!programState.showAnswers && <Button variant="contained" color="primary" onClick={handleFinishAnswering}>Näytä vastaukset</Button>}
    </div>
  );
}

// Creates a program state object from given course data. Program state keeps track of user's selections in course questionnaires.
const formNewProgramState = (courseData, UIDGenerator) => {
  return courseData.map((course) => ({                 // Map a course's questions to UI drawing list
      questions: course.questions.map((question) => ({ // Map questions of a course to UI drawing list
        answers: question.answers.map(() => ({         // Map a question's answers list to UI drawing list
          checked:false, 
          id: UIDGenerator.generateSync()
        })),
        id: UIDGenerator.generateSync()
      })),
      id: UIDGenerator.generateSync()
    }));
}

const App = () => {
  const [courseData, setCourseData] = useState([]);
  const [programState, setProgramState] = useState({});

  useEffect(() => {
    /*
    const localStorageState = window.localStorage.getItem("programState");
    const localStorageData = window.localStorage.getItem("courseData");
    if (localStorageState && localStorageData) {
      setCourseData(JSON.parse(localStorageState));
      setProgramState(JSON.parse(localStorageData));
    } else {
    */
      axios
        .get('http://localhost:3001/kurssit')
        .then((response) => {
          const newProgramState = {};
          newProgramState.activeCourse = 0;
          newProgramState.UIDGenerator = new UIDGenerator();
          newProgramState.showAnswers = false;
          newProgramState.courses = formNewProgramState(response.data, newProgramState.UIDGenerator);
          setCourseData(response.data);
          setProgramState(newProgramState);
          window.localStorage.setItem("courseData", JSON.stringify(response.data));
          window.localStorage.setItem("programState", JSON.stringify(newProgramState));
        }
      );
    //}
  }, []);

  // Functionality to change courses based on clicks
  const handleCourseSelection = (courseIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.activeCourse = courseIndex;
    newProgramState.showAnswers = false;
    setProgramState(newProgramState);
    window.localStorage.setItem("programState", JSON.stringify(newProgramState));
  }

  // Functionality to set an answer selected
  const handleAnswerSelection = (courseIndex, questionInedex) => (answerIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionInedex].answers[answerIndex].checked = !newProgramState.courses[courseIndex].questions[questionInedex].answers[answerIndex].checked;
    setProgramState(newProgramState);
    window.localStorage.setItem("programState", JSON.stringify(newProgramState));
  }

  // Functionality to finish answering and move to check for correctness
  const handleFinishAnswering = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.showAnswers = true;
    setProgramState(newProgramState);
    window.localStorage.setItem("programState", JSON.stringify(newProgramState));
  }

  return (
    <div className="App">
      <Header/>
      <main className="mainContent">
        {courseData.length > 0 && programState.courses &&
        <>
          <CourseExamQuestions
            courseData={courseData}
            programState={programState}
            handleAnswerSelection={handleAnswerSelection}
            handleFinishAnswering={handleFinishAnswering}
          />
          <CourseSelectionList 
            courseData={courseData}
            programState={programState}
            handleCourseSelection={handleCourseSelection}
          />
        </>}
      </main>
    </div>
  );
}

export default App;
