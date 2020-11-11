import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const AdminQuestion = ({question, handleAnswerAdding, handleAnswerDeletion, handleAnswerCorrectnessSetting, handleQuestionStringChange, handleAnswerStringChange}) => {
  console.log("admin questions: question:", question);
  return (
    <div>
      <Paper className="Question">
        <p>
          <input value={question.questionString} onChange={handleQuestionStringChange}></input>
        </p>
        {question.answers.map((answer, answerIndex) => 
          <div key={answer.id}>
            <Checkbox 
              color="primary" 
              onChange={handleAnswerCorrectnessSetting(answerIndex)} 
              checked={answer.isCorrectAnswer} 
              readOnly={true}
            />
            <input value={answer.answerString} onChange={handleAnswerStringChange(answerIndex)}></input>
            <Button onClick={handleAnswerDeletion(answerIndex)}>Delete</Button>
          </div>
        )}
        <Button onClick={handleAnswerAdding}>Add answer</Button>
      </Paper>
    </div>
  );
}

export default AdminQuestion;