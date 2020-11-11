import Button from '@material-ui/core/Button';

const AdminCourseSelectionList = ({courses, handleCourseSelection, handleCourseAddition, handleCourseDeletion}) => {
  return (
    <div className="CourseSelectionList">
      {courses.map((course, courseIndex) => 
      <Button 
        key={course.id} 
        color="primary" 
        className="CourseSelectionListItem" 
        onClick={handleCourseSelection(courseIndex)
      }>
        {course.courseName}
      </Button>
      )}
    </div>
  );
}

export default AdminCourseSelectionList;