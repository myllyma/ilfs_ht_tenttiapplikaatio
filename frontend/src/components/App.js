import "../css/App.css";
import axios from "axios";
import {useContext, useEffect} from "react";
import {IntlProvider} from "react-intl";

import {Context} from "../utility/provider.js";
import {SERVER_URI} from "../utility/config"
import MainDisplay from "./MainDisplay";
import messages_fi from "../translations/fi.js";
import messages_en from "../translations/en.js";
import {changeLanguage} from "../utility/callbacks";

const messages = {
  "fi": messages_fi,
  "en": messages_en
}

const App = () => {
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    (async () => {
      const user = JSON.parse(window.localStorage.getItem("user"));
      if (user) {
        const permittedExams = await axios.get(`${SERVER_URI}/exam/permitted`, {headers: {"Authorization": `Token ${user.userToken}`}});
        let examList = permittedExams.data.map(async (exam) => 
          await axios.get(`${SERVER_URI}/exam/${exam.examid}`, {headers: {"Authorization": `Token ${user.userToken}`}})
        );
        examList = await Promise.all(examList);
        examList = examList.map(exam => exam.data);

        dispatch({type: "LOGIN", user: user});
        dispatch({type: "SET_EXAMS", exams: examList});
        dispatch({type: "TOGGLE_PAGE", page: "EXAMS"});
        dispatch({type: "SWITCH_EXAM", examIndex: 0});
        
      } else {
        dispatch({type: "LOGIN", user: {}});
        dispatch({type: "SET_EXAMS", exams: []});
        dispatch({type: "SWITCH_EXAM", examIndex: 0});
        dispatch({type: "TOGGLE_PAGE", page: "LOGIN"});
      }
      
      const userLanguage = localStorage.getItem("userLanguage");
      if (userLanguage) {
        changeLanguage(dispatch, userLanguage);
      } else {
        changeLanguage(dispatch, "fi");
      }

      dispatch({type: "INIT"});
    })();                  
  }, [dispatch]);

  console.log(state);

  const locale = state.language || "fi";

  return(
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="fi">
      <MainDisplay/>
    </IntlProvider>
  );
}

export default App;
