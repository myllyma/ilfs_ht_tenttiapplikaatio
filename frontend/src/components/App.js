import {useContext, useEffect} from 'react';
import axios from 'axios';
import uuid from 'react-uuid'
import '../css/App.css';
import Header from '../components/Header';
import CourseSelectionList from '../components/CourseSelectionList';
import CourseContents from '../components/CourseContents';
import AdminCourseSelectionList from '../components/AdminCourseSelectionList';
import AdminCourseContents from '../components/AdminCourseContents';
import {Context} from '../utility/provider.js';

const App = () => {
  const {state, dispatch} = useContext(Context);

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
        dispatch({type: "INIT", payload: newProgramState});
      }
    );                  
  }, [dispatch]);

  return (
    state.courses ?
    <div className="App">
      <Header/>
      <main className="mainContent">
        {
        state.admin ?
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
    :
    <div></div>
  );
}

export default App;
