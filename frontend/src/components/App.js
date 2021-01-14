import "../css/App.css";
import axios from "axios";
import {useContext, useEffect} from "react";
import {IntlProvider} from "react-intl";


import {Context} from "../utility/provider.js";
import {SERVER_URI} from "../utility/config"
import messages_fi from "../translations/fi.js";
import messages_en from "../translations/en.js";

import MainDisplay from "./MainDisplay";

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

  return(
    <IntlProvider messages={messages[state.language]} locale={state.language} defaultLocale="fi">
      <MainDisplay/>
    </IntlProvider>
  );
}

export default App;
