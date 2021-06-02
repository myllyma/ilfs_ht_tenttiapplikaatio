const verifyGetExamContents = (body, params) => {
  if (!("examId" in params)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message params.", details: "" });}
  if (typeof params.examId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}

  return ({error: false});
}

const verifyPostNewExam = (body, params) => {
  if (!("courseId" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing courseId-field from message body.", details: "" });}
  if (typeof body.courseId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, courseId-field is of incorrect type, number expected.", details: "" });}

  return ({error: false});
}

const verifyDeleteExam = (body, params) => {
  if (!("examId" in params)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message params.", details: "" });}
  if (typeof params.examId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}

  return ({error: false});
}

const verifySetExamName = (body, params) => {
  if (!("examId" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing examId-field from message body.", details: "" });}
  if (typeof body.examId !== "string") {return ({error: true, type: "MalformedRequest", message: "Malformed request, examId-field is of incorrect type, number expected.", details: "" });}
  if (!("newExamName" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing newExamName-field from message body.", details: "" });}
  if (typeof body.newExamName !== "string") {return ({error: true, type: "MalformedRequest", message: "Malformed request, newExamName-field is of incorrect type, string expected.", details: "" });}

  return ({error: false});
}

module.exports = {
  verifyGetExamContents,
  verifyPostNewExam,
  verifyDeleteExam,
  verifySetExamName
}