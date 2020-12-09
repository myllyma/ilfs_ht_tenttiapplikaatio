import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import Questions from './Question';
import {userTogglesDoneWithAnswering} from '../utility/callbacks';

const ExamContents = () => {
  const {state, dispatch} = useContext(Context);

  if (!("exams" in state) || !state.exams[state.activeExam]) {
    return (<div/>);
  } else {
    return(
      <div>
        <div>
          {state.exams[state.activeExam].questions.map((question, questionIndex) => 
              question &&
              <Questions key={question.id} examIndex={state.activeExam} questionIndex={questionIndex}/>
          )}
        </div>
        {!state.showAnswers && <Button variant="contained" color="primary" onClick={userTogglesDoneWithAnswering(dispatch)}>Näytä vastaukset</Button>}
      </div>
    );
  }
}

export default ExamContents;