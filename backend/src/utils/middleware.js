const unknownEndpoint = (req, res) => {
  res.status(404).send({ error:"unknown endpoint"})
}

const errorHandler = (err, req, res, next) => {
  console.log("Error: ", err);

  switch (err.type) {
    case "DatabaseError":
      return res.status(500).send({error: err.errorText}).end();
    case "ResourceNotLocated":
      return res.status(404).json({error: err.errorText}).end();
    case "MalformedRequest":
      return res.status(400).json({error: err.errorText}).end();
    case "LoginError":
      return res.status(401).json({error: err.errorText}).end();
    case "SignupError":
      return res.status(400).json({error: err.errorText}).end();
  }
}

module.exports = {
  unknownEndpoint,
  errorHandler
}