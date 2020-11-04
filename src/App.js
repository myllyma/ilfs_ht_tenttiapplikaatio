import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import UIDGenerator from 'uid-generator';

const Header = () => {
  return (
    <ul className="Header">
      <li>Tentit</li>
      <li>Tietoa sovelluksesta</li>
      <li>Poistu</li>
    </ul>
  );
}

const CourseSelectionList = ({courseData, programState, handleCourseSelection}) => {
  return (
    programState.courses ?
    <ul className="CourseSelectionList">
      {courseData.map((course, courseIndex) => 
      <li key={programState.courses[courseIndex].id} onClick={handleCourseSelection(courseIndex)}>{course.courseName}</li>
      )}
    </ul>
    :
    <div></div>
  );
}

const Question = ({question, programState, handleAnswerSelection}) => {
  return(
    <div className="Question">
      <p>{question.questionString}</p>
      {question.answers.map((answer, answerIndex) => 
        <div key={programState.answers[answerIndex].id}>
          <input type="checkbox" onChange={handleAnswerSelection(answerIndex)} checked={programState.answers[answerIndex].checked}/>{answer.answerString}
        </div>
      )}
    </div>
  );
}

const ExamQuestions = ({questions, programState, handleAnswerSelection}) => {
  return (
    <div className="ExamQuestions">
      {questions.questions.map((question, questionIndex) => 
        <Question
          key={programState.questions[questionIndex].id}
          programState={programState.questions[questionIndex]}
          question={question}
          handleAnswerSelection={handleAnswerSelection(questionIndex)}/>
      )}
    </div>
  );
}

const ExamQuestionsAnswers = () => {
  return(
    <div className="ExamQuestionsAnswers">

    </div>
  );
}

const CourseExamQuestions = ({courseData, programState, handleAnswerSelection, handleFinishAnswering}) => {
  if (!programState.showAnswers) {
    return(
      programState.courses ?
      <div className="CourseExamQuestions">
        <ExamQuestions
          questions={courseData[programState.activeCourse]}
          programState={programState.courses[programState.activeCourse]}
          handleAnswerSelection={handleAnswerSelection(programState.activeCourse)}/>
        <button onClick={handleFinishAnswering}>Näytä vastaukset</button>
      </div>
      :
      <div></div>
    );
  } else {
    return(
      programState.courses ?
      <div className="CourseExamQuestions">
        <ExamQuestionsAnswers
          questions={courseData[programState.activeCourse]}
          programState={programState.courses[programState.activeCourse]}
          handleAnswerSelection={handleAnswerSelection(programState.activeCourse)}/>
      </div>
      :
      <div></div>
    );
  }
}

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
      }
    );
  }, []);

  const handleCourseSelection = (courseIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.activeCourse = courseIndex;
    newProgramState.showAnswers = false;
    setProgramState(newProgramState);
  }

  const handleAnswerSelection = (courseIndex) => (questionInedex) => (answerIndex) => () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.courses[courseIndex].questions[questionInedex].answers[answerIndex].checked = !newProgramState.courses[courseIndex].questions[questionInedex].answers[answerIndex].checked;
    setProgramState(newProgramState);
  }

  const handleFinishAnswering = () => {
    const newProgramState = JSON.parse(JSON.stringify(programState));
    newProgramState.showAnswers = true;
    setProgramState(newProgramState);
  }

  return (
    <div className="App">
      <Header/>
      <CourseSelectionList 
        courseData={courseData}
        programState={programState}
        handleCourseSelection={handleCourseSelection}/>
      <CourseExamQuestions
        courseData={courseData}
        programState={programState}
        handleAnswerSelection={handleAnswerSelection}
        handleFinishAnswering={handleFinishAnswering}/>
    </div>
  );
}

export default App;
