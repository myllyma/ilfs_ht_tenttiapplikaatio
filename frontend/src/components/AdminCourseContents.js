import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import AdminQuestion from './AdminQuestion';
import {addQuestion, deleteQuestion} from '../utility/callbacks';

const AdminCourseContents = () => {
  const {state, dispatch} = useContext(Context);

  return(
    <div>
      {state.courses[state.activeCourse].questions.map((question, questionIndex) => 
        <div key={question.id}>
          <AdminQuestion courseIndex={state.activeCourse} questionIndex={questionIndex}/>
          <Button onClick={deleteQuestion(dispatch, state.activeCourse, questionIndex)}>Delete</Button>
        </div>
      )}
      <Button onClick={addQuestion(dispatch, state.activeCourse)}>Add question</Button>
    </div>
  );
}

export default AdminCourseContents;