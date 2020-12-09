import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import {switchExam} from '../utility/callbacks';

const ExamSelectionList = () => {
  const {state, dispatch} = useContext(Context);

  if (!("exams" in state)) {
    return (<div/>);
  } else {
    return (
      <div>
        {state.exams.map((exam, examIndex) => 
          exam &&
          <Button key={exam.id} color="primary" className="ExamSelectionListItem" onClick={switchExam(dispatch, examIndex)}>
            {exam.name}
          </Button>
        )}
      </div>
    );
  }
}

export default ExamSelectionList;