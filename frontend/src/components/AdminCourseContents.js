import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/Input';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AdminQuestion from './AdminQuestion';
import {inputQuestionContent, inputQuestionCategory, addQuestion, deleteQuestion} from '../utility/callbacks';

const AdminCourseContents = () => {
  const {state, dispatch} = useContext(Context);

  return(
    <div>
      {state.courses[state.activeCourse].questions.map((question, questionIndex) => 
        <Paper key={question.id}>
          <div>
            <TextField 
              value={state.courses[state.activeCourse].questions[questionIndex].questionString}
              onChange={inputQuestionContent(dispatch, state.activeCourse, questionIndex)}
              label="Kysymys" />
            <TextField
              value={state.courses[state.activeCourse].questions[questionIndex].category}
              onChange={inputQuestionCategory(dispatch, state.activeCourse, questionIndex)}
              label="Kategoria" />
            <Button onClick={deleteQuestion(dispatch, state.activeCourse, questionIndex)}><DeleteIcon/></Button>
          </div>
          <AdminQuestion courseIndex={state.activeCourse} questionIndex={questionIndex} />
        </Paper>
      )}
      <Button onClick={addQuestion(dispatch, state.activeCourse)}>Lisää kysymys<AddIcon/></Button>
    </div>
  );
}

export default AdminCourseContents;