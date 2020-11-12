import Button from '@material-ui/core/Button';

// Display the list of available course
const CourseSelectionList = ({courses, handleCourseSelection}) => {
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

export default CourseSelectionList;