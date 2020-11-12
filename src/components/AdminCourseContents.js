import Button from '@material-ui/core/Button';
import AdminQuestion from './AdminQuestion';

// Admin version of CourseContents that implements functionality to add and delete questions.
const AdminCourseContents = ({course, activeCourse, handleQuestionAdding, handleQuestionDeletion, handleAnswerAdding, handleAnswerDeletion, handleAnswerCorrectnessSetting, handleQuestionStringChange, handleAnswerStringChange}) => {
  return(
    <div className="CourseExamQuestions">
      <div className="ExamQuestions">
        {course.questions.map((question, questionIndex) => 
          <div key={question.id}>
            <AdminQuestion
              question={question}
              handleAnswerAdding={handleAnswerAdding(activeCourse, questionIndex)}
              handleAnswerDeletion={handleAnswerDeletion(activeCourse, questionIndex)}
              handleAnswerCorrectnessSetting={handleAnswerCorrectnessSetting(activeCourse, questionIndex)}
              handleQuestionStringChange={handleQuestionStringChange(activeCourse, questionIndex)}
              handleAnswerStringChange={handleAnswerStringChange(activeCourse, questionIndex)}
            />
            <Button onClick={handleQuestionDeletion(activeCourse, questionIndex)}>Delete</Button>
          </div>
        )}
        <Button onClick={handleQuestionAdding(activeCourse)}>Add question</Button>
      </div>
    </div>
  );
}

export default AdminCourseContents;