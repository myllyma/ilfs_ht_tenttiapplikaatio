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

  return (
    <div>
      {state.exams.map((exam, examIndex) => 
        <Button key={exam.id} color="primary" className="ExamSelectionListItem">
          <CheckIcon onClick={switchExam(dispatch, examIndex)} />
          <TextField 
            value={exam.examName}
            onChange={inputExamName(dispatch, examIndex)}
            label="Kurssin nimi" />
          <DeleteIcon onClick={deleteExam(dispatch, examIndex)} />
        </Button> 
      )}
      <Button onClick={addExam(dispatch)}><AddIcon/></Button>
    </div>
  );
}

export default AdminExamSelectionList;