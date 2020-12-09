import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import {switchExam, inputExamName, deleteExam, addExam} from '../utility/callbacks';

const AdminExamSelectionList = () => {
  const {state, dispatch} = useContext(Context);

  if (!("exams" in state)) {
    return (<div/>);
  } else {
    return (
      <div>
        {state.exams.map((exam, examIndex) => 
          exam&&
          <Button key={exam.id} color="primary" className="ExamSelectionListItem">
            <CheckIcon onClick={switchExam(dispatch, examIndex)} />
            <TextField 
              value={exam.name}
              onChange={inputExamName(dispatch, examIndex, state.exams[state.activeExam].id)}
              label="Kurssin nimi" />
            <DeleteIcon onClick={deleteExam(dispatch, examIndex, state.exams[state.activeExam].id)} />
          </Button> 
        )}
        <Button onClick={addExam(dispatch)}><AddIcon/></Button>
      </div>
    );
  }
}

export default AdminExamSelectionList;