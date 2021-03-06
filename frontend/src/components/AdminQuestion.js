import {useContext, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/Input';

import {Context} from '../utility/provider.js';
import {toggleAnswerCorrectness, inputAnswerString, deleteAnswer, addAnswer, uploadFile} from '../utility/callbacks';

const AdminQuestion = ({examIndex, questionIndex}) => {
  const {state, dispatch} = useContext(Context);
  const onDrop = useCallback(files => uploadFile(dispatch, examIndex, questionIndex, state.user, files), [dispatch, examIndex, questionIndex, state.user]);
  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div>
      {state.exams[examIndex].questions[questionIndex].answers.map((answer, answerIndex) => 
        <div key={answer.id}>
          <Checkbox 
            color="primary" 
            onChange={toggleAnswerCorrectness(dispatch, examIndex, questionIndex, answerIndex, state.exams[examIndex].questions[questionIndex].answers[answerIndex].id, state.user)} 
            checked={answer.isAnswerCorrect}/>
          <TextField
            value={answer.answerString}
            onChange={inputAnswerString(dispatch, examIndex, questionIndex, answerIndex, state.exams[examIndex].questions[questionIndex].answers[answerIndex].id, state.user)} />
          <Button  onClick={deleteAnswer(dispatch, examIndex, questionIndex, answerIndex, state.exams[examIndex].questions[questionIndex].answers[answerIndex].id, state.user)}><DeleteIcon/></Button>
        </div>
      )}
      <div>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <FormattedMessage id="drag_drop_prompt"/>
        </div>
      </div>
      <Button onClick={addAnswer(dispatch, examIndex, questionIndex, state.exams[examIndex].questions[questionIndex].id, state.user)}><AddIcon/></Button>
    </div>  
  );
}

export default AdminQuestion;