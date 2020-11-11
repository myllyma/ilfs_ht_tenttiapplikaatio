import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const AdminQuestion = ({question, handleAnswerAdding, handleAnswerDeletion, handleAnswerCorrectnessSetting}) => {
  return (
    <div>
      <Paper className="Question">
        <p>
          {question.questionString}
        </p>
        {question.answers.map((answer, answerIndex) => 
          <div key={answer.id}>
            <Checkbox 
              color="primary" 
              onChange={handleAnswerCorrectnessSetting(answerIndex)} 
              checked={answer.checked} 
              readOnly={true}
            />
            {answer.answerString}
            <Button onClick={handleAnswerDeletion(answerIndex)}>Delete</Button>
          </div>
        )}
        <Button onClick={handleAnswerAdding}>Add answer</Button>
      </Paper>
    </div>
  );
}

export default AdminQuestion;