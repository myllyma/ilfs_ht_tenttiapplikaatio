import "../css/App.css";
import {useContext, useEffect} from "react";
import {IntlProvider} from "react-intl";

import {Context} from "../utility/provider.js";
import MainDisplay from "./MainDisplay";
import messages_fi from "../translations/fi.js";
import messages_en from "../translations/en.js";
import {initialize} from "../utility/callbacks";

const messages = {
  "fi": messages_fi,
  "en": messages_en
}

const App = () => {
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    (() => {
      initialize(dispatch); 
    })();                  
  }, [dispatch]);

  const locale = state.language || "fi";
  console.log("state: ", state);

  return(
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="fi">
      <MainDisplay/>
    </IntlProvider>
  );
}

export default App;
