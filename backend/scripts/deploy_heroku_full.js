const shell = require("shelljs");

shell.exec("npm run build_frontend");
shell.exec("npm run deploy_heroku");