const verifyPostAnswer = (body, params) => {
  if (!("questionId" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing questionId-field from message body.", details: "" });}
  if (typeof body.questionId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, questionId-field is of incorrect type, number expected.", details: "" });}

  return ({error: false});
}

const verifyDeleteAnswer = (body, params) => {
  if (!("questionId" in params)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing questionId-field from message body.", details: "" });}
  if (typeof params.questionId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, questionId-field is of incorrect type, number expected.", details: "" });}

  return ({error: false});
}

const verifySetAnswerString = (body, params) => {
  if (!("answerId" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing answerId-field from message body.", details: "" });}
  if (typeof body.answerId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, answerId-field is of incorrect type, number expected.", details: "" });}
  if (!("newAnswerString" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing newAnswerString-field from message body.", details: "" });}
  if (typeof body.newAnswerString !== "string") {return ({error: true, type: "MalformedRequest", message: "Malformed request, newAnswerString-field is of incorrect type, string expected.", details: "" });}

  return ({error: false});
}

const verifyInvertAnswerState = (body, params) => {
  if (!("answerId" in body)) {return ({error: true, type: "MalformedRequest", message: "Malformed request, missing answerId-field from message body.", details: "" });}
  if (typeof body.answerId !== "number") {return ({error: true, type: "MalformedRequest", message: "Malformed request, answerId-field is of incorrect type, number expected.", details: "" });}

  return ({error: false});
}

module.exports = {
  verifyPostAnswer,
  verifyDeleteAnswer,
  verifySetAnswerString,
  verifyInvertAnswerState
}