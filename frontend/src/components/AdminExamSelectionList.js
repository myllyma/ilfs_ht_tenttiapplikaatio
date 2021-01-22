import {useContext} from 'react';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';

import {Context} from '../utility/provider.js';
import {switchExam, inputExamName, deleteExam, addExam} from '../utility/callbacks';

const AdminExamSelectionList = () => {
  const {state, dispatch} = useContext(Context);

  if (!("exams" in state)) {
    return (<div/>);
  } else {
    return (
      <div className="ExamList">
        {state.exams.map((exam, examIndex) => 
          exam&&
          <Button key={exam.id} color="primary" className="ExamSelectionListItem">
            <CheckIcon onClick={switchExam(dispatch, examIndex)} />
            <TextField 
              value={exam.name}
              onChange={inputExamName(dispatch, examIndex, state.exams[examIndex].id, state.user)}
              label="Kurssin nimi" />
            <DeleteIcon onClick={deleteExam(dispatch, examIndex, state.exams[examIndex].id, state.user)} />
          </Button> 
        )}
        <Button onClick={addExam(dispatch, state.user)}><AddIcon/></Button>
      </div>
    );
  }
}

export default AdminExamSelectionList;