import {useContext} from "react";
import {Context} from "../utility/provider.js";

import Login from "./Login";
import Header from "./Header";
import ExamSelectionList from "./ExamSelectionList";
import ExamContents from "./ExamContents";
import AdminExamSelectionList from "./AdminExamSelectionList";
import AdminExamContents from "./AdminExamContents";
import Visualization from "./Visualization";

const MainDisplay = () => {
  const {state} = useContext(Context);

  if (!("exams" in state)) {
    return(
        <div className="MainDisplay">
          <Header/>
        </div>
    );
  } else {
    switch (state.visiblePage) {
      case "LOGIN":
        return (
          <div className="MainDisplay">
            <Login/>
          </div>
        );

      case "EXAMS":
        return (
          <div className="MainDisplay">
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
          <div className="MainDisplay">
            <Header/>
            <main className="mainContent">
              <Visualization/>
            </main>
          </div>
        );
  
      default:
        return(
          <div className="MainDisplay">
            <Header/>
          </div>
      );
    }
  }
}

export default MainDisplay;