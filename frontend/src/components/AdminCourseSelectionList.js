import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import Button from '@material-ui/core/Button';
import {addCourse, switchCourse} from '../utility/callbacks';

const AdminCourseSelectionList = () => {
  const {state, dispatch} = useContext(Context);

  return (
    <div>
      {state.courses.map((course, courseIndex) => 
        <Button key={course.id} color="primary" className="CourseSelectionListItem" onClick={switchCourse(dispatch, courseIndex)}>
          {course.courseName}
        </Button> 
      )}
      <Button onClick={addCourse(dispatch)}>Add course</Button>
    </div>
  );
}

export default AdminCourseSelectionList;