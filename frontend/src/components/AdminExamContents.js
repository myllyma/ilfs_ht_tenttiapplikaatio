import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/Input';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AdminQuestion from './AdminQuestion';
import {inputQuestionContent, inputQuestionCategory, addQuestion, deleteQuestion} from '../utility/callbacks';

const AdminExamContents = () => {
  const {state, dispatch} = useContext(Context);

  return(
    <div>
      {state.exams[state.activeExam].questions.map((question, questionIndex) => 
        <Paper key={question.id}>
          <div>
            <TextField 
              value={state.exams[state.activeExam].questions[questionIndex].questionString}
              onChange={inputQuestionContent(dispatch, state.activeExam, questionIndex)}
              label="Kysymys" />
            <TextField
              value={state.exams[state.activeExam].questions[questionIndex].category}
              onChange={inputQuestionCategory(dispatch, state.activeExam, questionIndex)}
              label="Kategoria" />
            <Button onClick={deleteQuestion(dispatch, state.activeExam, questionIndex)}><DeleteIcon/></Button>
          </div>
          <AdminQuestion examIndex={state.activeExam} questionIndex={questionIndex} />
        </Paper>
      )}
      <Button onClick={addQuestion(dispatch, state.activeExam)}>Lisää kysymys<AddIcon/></Button>
    </div>
  );
}

export default AdminExamContents;