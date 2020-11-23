import {useContext, useEffect} from 'react';
import axios from 'axios';
import '../css/App.css';
import Header from '../components/Header';
import CourseSelectionList from '../components/CourseSelectionList';
import CourseContents from '../components/CourseContents';
import AdminCourseSelectionList from '../components/AdminCourseSelectionList';
import AdminCourseContents from '../components/AdminCourseContents';
import {Context} from '../utility/provider.js';
import Visualization from './Visualization';

const App = () => {
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/courses')
      .then((response) => {
        const newProgramState = {};
        newProgramState.activeCourse = 0;
        newProgramState.showAnswers = false;
        newProgramState.admin = false;
        newProgramState.visiblePage = "EXAMS";
        newProgramState.courses = response.data.map((course) => ({
          ...course,
          questions: course.questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) => ({
              ...answer,
              isChecked: false,
            })),
          })),
        }));
        dispatch({type: "INIT", payload: newProgramState});
      }
    );                  
  }, [dispatch]);

  console.log("Program state: ", state);

  if (!state.courses) {
    return(
      <div>
        <Header/>
      </div>
    );
  }

  switch (state.visiblePage) {
    case "EXAMS":
      return (
        <div className="App">
          <Header/>
          <main className="mainContent">
            {!state.admin ?
            <>
              <CourseSelectionList/>
              <CourseContents/>
            </>
            :
            <>
              <AdminCourseSelectionList/>
              <AdminCourseContents/>
            </>}
          </main>
        </div>
      );
    case "VISUALIZATION":
      return (
        <div className="App">
          <Header/>
          <main className="mainContent">
            <Visualization/>
          </main>
        </div>
      );
    default:
      return(
        <div>
          <Header/>
        </div>
      );
  }
  
}

export default App;
