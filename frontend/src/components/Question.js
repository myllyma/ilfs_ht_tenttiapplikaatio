import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import {userTogglesAnswer} from '../utility/callbacks';

// Display an individual question
const Question = ({examIndex, questionIndex}) => {
  const {state, dispatch} = useContext(Context);

  const question = state.exams[examIndex].questions[questionIndex];

  let showCorrectAnswerMark = true;
  question.answers.forEach((userAnswer) => { 
    if (userAnswer.isChecked !== userAnswer.isAnswerCorrect) {
      showCorrectAnswerMark = false;
    }
  });
  
  return(
    <Paper>
      <p>
        {question.questionString} 
        {state.showAnswers && showCorrectAnswerMark && <img className="dogImage" src="dog_image.png" alt="dog head"/>}
      </p>
      {question.answers.map((answer, answerIndex) => 
        <div key={answer.id}>
          <Checkbox 
            color="primary" 
            onChange={userTogglesAnswer(dispatch, examIndex, questionIndex, answerIndex)} 
            checked={answer.isChecked} 
            readOnly={true}
          />
         {state.showAnswers && 
            <Checkbox 
              color="secondary" 
              checked={answer.isAnswerCorrect} 
              readOnly={true}
            />
          }
          {answer.answerString}
        </div>
      )}
    </Paper>
  );
}

export default Question;