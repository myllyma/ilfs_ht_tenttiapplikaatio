import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

const AdminQuestions = ({question, handleAnswerCorrectnessSetting, removeQuestion, addQuestion}) => {
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
          </div>
        )}
      </Paper>
    </div>
  );
}

export default AdminQuestions;