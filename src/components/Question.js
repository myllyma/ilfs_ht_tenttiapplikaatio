import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

// Display an individual question
const Question = ({question, showAnswers, handleAnswerSelection}) => {
  let showCorrectAnswerMark = true;
  question.answers.forEach((userAnswer) => { 
      if (userAnswer.isChecked !== userAnswer.isCorrectAnswer) {
        showCorrectAnswerMark = false;
      }
    });
  
    return(
      <Paper className="Question">
        <p>
          {question.questionString} 
          {showAnswers && showCorrectAnswerMark && <img className="dogImage" src="dog_image.png" alt="dog head"/>}
        </p>
        {question.answers.map((answer, answerIndex) => 
          <div key={answer.id}>
            <Checkbox 
              color="primary" 
              onChange={handleAnswerSelection(answerIndex)} 
              checked={answer.isChecked} 
              readOnly={true}
            />
            {showAnswers && 
              <Checkbox 
                color="secondary" 
                checked={answer.isCorrectAnswer} 
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