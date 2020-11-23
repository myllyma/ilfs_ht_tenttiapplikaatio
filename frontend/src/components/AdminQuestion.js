import {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {Context} from '../utility/provider.js';
import {inputQuestionContent, toggleAnswerCorrectness, inputAnswerContent, inputQuestionCategory, deleteAnswer, addAnswer} from '../utility/callbacks';

const AdminQuestion = ({courseIndex, questionIndex}) => {
  const {state, dispatch} = useContext(Context);

  return (
    <div>
      <Paper>
        <p>
          Kysymys
          <input value={state.courses[courseIndex].questions[questionIndex].questionString} onChange={inputQuestionContent(dispatch, courseIndex, questionIndex)}></input>
          Kategoria
          <input value={state.courses[courseIndex].questions[questionIndex].category} onChange={inputQuestionCategory(dispatch, courseIndex, questionIndex)}></input>
        </p>
        {state.courses[courseIndex].questions[questionIndex].answers.map((answer, answerIndex) => 
          <div key={answer.id}>
            <Checkbox 
              color="primary" 
              onChange={toggleAnswerCorrectness(dispatch, courseIndex, questionIndex, answerIndex)} 
              checked={answer.isCorrectAnswer}/>
            <input value={answer.answerString} onChange={inputAnswerContent(dispatch, courseIndex, questionIndex, answerIndex)}></input>
            <Button  onClick={deleteAnswer(dispatch, courseIndex, questionIndex, answerIndex)}>Delete</Button>
          </div>
        )}
        <Button onClick={addAnswer(dispatch, courseIndex, questionIndex)}>Add answer</Button>
      </Paper>
    </div>
  );
}

export default AdminQuestion;