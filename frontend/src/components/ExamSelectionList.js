import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import {switchExam} from '../utility/callbacks';

const ExamSelectionList = () => {
  const {state, dispatch} = useContext(Context);

  return (
    <div>
      {state.exams.map((exam, examIndex) => 
        <Button key={exam.id} color="primary" className="ExamSelectionListItem" onClick={switchExam(dispatch, examIndex)}>
          {exam.examName}
        </Button>
      )}
    </div>
  );
}

export default ExamSelectionList;