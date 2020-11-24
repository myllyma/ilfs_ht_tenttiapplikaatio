import {useContext} from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/Input';
import {Context} from '../utility/provider.js';
import {toggleAnswerCorrectness, inputAnswerContent, deleteAnswer, addAnswer} from '../utility/callbacks';

const AdminQuestion = ({courseIndex, questionIndex}) => {
  const {state, dispatch} = useContext(Context);

  return (
    <div>
      {state.courses[courseIndex].questions[questionIndex].answers.map((answer, answerIndex) => 
        <div key={answer.id}>
          <Checkbox 
            color="primary" 
            onChange={toggleAnswerCorrectness(dispatch, courseIndex, questionIndex, answerIndex, state.courses[courseIndex].questions[questionIndex].answers[answerIndex].isCorrectAnswer)} 
            checked={answer.isCorrectAnswer}/>
          <TextField
            value={answer.answerString}
            onChange={inputAnswerContent(dispatch, courseIndex, questionIndex, answerIndex)} />
          <Button  onClick={deleteAnswer(dispatch, courseIndex, questionIndex, answerIndex)}><DeleteIcon/></Button>
        </div>
      )}
      <Button onClick={addAnswer(dispatch, courseIndex, questionIndex)}><AddIcon/></Button>
    </div>
  );
}

export default AdminQuestion;