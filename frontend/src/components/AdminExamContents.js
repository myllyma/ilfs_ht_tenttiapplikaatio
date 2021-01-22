import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/Input';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AdminQuestion from './AdminQuestion';
import {inputQuestionContent, inputQuestionSubject, addQuestion, deleteQuestion} from '../utility/callbacks';

const AdminExamContents = () => {
  const {state, dispatch} = useContext(Context);

  if (!("exams" in state) || !state.exams[state.activeExam]) {
    return (<div/>);
  } else {
    return(
      <div>
        {state.exams[state.activeExam].questions.map((question, questionIndex) => 
          question &&
          <Paper key={question.id}>
            <div>
              <TextField 
                value={state.exams[state.activeExam].questions[questionIndex].questionString}
                onChange={inputQuestionContent(dispatch, state.activeExam, questionIndex, state.exams[state.activeExam].questions[questionIndex].id, state.user)}
                label="Kysymys" />
              <TextField
                value={state.exams[state.activeExam].questions[questionIndex].subject}
                onChange={inputQuestionSubject(dispatch, state.activeExam, questionIndex, state.exams[state.activeExam].questions[questionIndex].id, state.user)}
                label="Kategoria" />
              <Button onClick={deleteQuestion(dispatch, state.activeExam, questionIndex, state.exams[state.activeExam].questions[questionIndex].id, state.user)}><DeleteIcon/></Button>
            </div>
            <AdminQuestion examIndex={state.activeExam} questionIndex={questionIndex} />
          </Paper>
        )}
        <Button onClick={addQuestion(dispatch, state.activeExam, state.exams[state.activeExam].id, state.user)}>Lisää kysymys<AddIcon/></Button>
      </div>
    );
  }
}

export default AdminExamContents;