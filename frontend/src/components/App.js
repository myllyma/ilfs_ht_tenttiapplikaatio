import '../css/App.css';
import axios from 'axios';
import Header from '../components/Header';
import {useContext, useEffect} from 'react';
import {Context} from '../utility/provider.js';
import ExamSelectionList from '../components/ExamSelectionList';
import ExamContents from '../components/ExamContents';
import AdminExamSelectionList from '../components/AdminExamSelectionList';
import AdminExamContents from '../components/AdminExamContents';
import Visualization from './Visualization';

const App = () => {
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`http://localhost:3001/api/exams`);
      const newProgramState = {};
        newProgramState.activeExam = 0;
        newProgramState.showAnswers = false;
        newProgramState.admin = false;
        newProgramState.visiblePage = "EXAMS";
        newProgramState.exams = response.data.map((exam) => ({
          ...exam,
          questions: exam.questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) => ({
              ...answer,
              isChecked: false,
            })),
          })),
        }));
        dispatch({type: "INIT", payload: newProgramState});
    })();                  
  }, [dispatch]);

  if (!state.exams) {
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
              <ExamSelectionList/>
              <ExamContents/>
            </>
            :
            <>
              <AdminExamSelectionList/>
              <AdminExamContents/>
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
