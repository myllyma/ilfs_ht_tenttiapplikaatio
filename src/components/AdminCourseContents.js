import AdminQuestions from './AdminQuestions';

const AdminCourseContents = ({course, showAnswers, activeCourse, handleAnswerSelection, handleAnswerAdding, handleAnswerDeletion, handleQuestionAdding, handleQuestionDeletion, handleAnswerCorrectnessSetting}) => {
  return(
    <div className="CourseExamQuestions">
      <div className="ExamQuestions">
        {course.questions.map((question, questionIndex) => {
          return(
            <AdminQuestions
              key={question.id}
              question={question}
              showAnswers={showAnswers}
              handleAnswerSelection={handleAnswerSelection(activeCourse, questionIndex)}
            />
          )
        }
        )}
      </div>
    </div>
  );
}

export default AdminCourseContents;