import Button from '@material-ui/core/Button';
import Questions from './Question';

// Displays the data for one course's exam
const CourseContents = ({course, activeCourse, showAnswers, handleAnswerSelection, handleFinishAnswering}) => {
  return(
    <div className="CourseExamQuestions">
      <div className="ExamQuestions">
        {course.questions.map((question, questionIndex) => {
          return(
            <Questions
              key={course.questions[questionIndex].id}
              question={question}
              programState={course.questions[questionIndex]}
              showAnswers={showAnswers}
              handleAnswerSelection={handleAnswerSelection(activeCourse, questionIndex)}
            />
          )
        }
        )}
      </div>
      {!showAnswers && <Button variant="contained" color="primary" onClick={handleFinishAnswering}>Näytä vastaukset</Button>}
    </div>
  );
}

export default CourseContents;