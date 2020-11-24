import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import {switchCourse, inputCourseName, deleteCourse, addCourse} from '../utility/callbacks';

const AdminCourseSelectionList = () => {
  const {state, dispatch} = useContext(Context);

  return (
    <div>
      {state.courses.map((course, courseIndex) => 
        <Button key={course.id} color="primary" className="CourseSelectionListItem">
          <CheckIcon onClick={switchCourse(dispatch, courseIndex)} />
          <TextField 
            value={course.courseName}
            onChange={inputCourseName(dispatch, courseIndex)}
            label="Kurssin nimi" />
          <DeleteIcon onClick={deleteCourse(dispatch, courseIndex)} />
        </Button> 
      )}
      <Button onClick={addCourse(dispatch)}><AddIcon/></Button>
    </div>
  );
}

export default AdminCourseSelectionList;