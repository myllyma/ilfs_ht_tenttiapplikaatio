import "../css/App.css";
import axios from "axios";
import Header from "../components/Header";
import {useContext, useEffect} from "react";
import {Context} from "../utility/provider.js";
import {SERVER_URI} from "../utility/config"
import ExamSelectionList from "../components/ExamSelectionList";
import ExamContents from "../components/ExamContents";
import AdminExamSelectionList from "../components/AdminExamSelectionList";
import AdminExamContents from "../components/AdminExamContents";
import Visualization from "./Visualization";
import {IntlProvider} from "react-intl";
import messages_fi from "../translations/fi.js";
import messages_en from "../translations/en.js";

const messages = {
  "fi": messages_fi,
  "en": messages_en
}

const App = () => {
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    (async () => {
      const permittedExams = await axios.get(`${SERVER_URI}/exam/permittedexams`);
      let examList = permittedExams.data.map(async (exam) => 
        await axios.get(`${SERVER_URI}/exam/getspecific/${exam.examid}`)
      );
      examList = await Promise.all(examList);
      examList = examList.map(exam => exam.data)
      const newProgramState = {};
        newProgramState.activeExam = 0;
        newProgramState.showAnswers = false;
        newProgramState.admin = false;
        newProgramState.visiblePage = "EXAMS";
        newProgramState.exams = examList
        newProgramState.language = "fi";
        dispatch({type: "INIT", payload: newProgramState});
    })();                  
  }, [dispatch]);

  console.log(state);

  if (!("exams" in state)) {
    return(
      <IntlProvider messages={messages.fi} locale="fi" defaultLocale="fi">
        <div>
          <Header/>
        </div>
      </IntlProvider>
    );
  }

  switch (state.visiblePage) {
    case "EXAMS":
      return (
        <IntlProvider messages={messages.fi} locale="fi" defaultLocale="fi">
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
        </IntlProvider>
      );

     case "VISUALIZATION":
      return (
        <IntlProvider messages={messages.fi} locale="fi" defaultLocale="fi">
          <div className="App">
            <Header/>
            <main className="mainContent">
              <Visualization/>
            </main>
          </div>
        </IntlProvider>
      );

    default:
      return(
        <IntlProvider messages={messages.fi} locale="fi" defaultLocale="fi">
          <div>
            <Header/>
          </div>
        </IntlProvider>
      );
  }
  
}

export default App;
