const shell = require("shelljs");

shell.exec("git add *");
shell.exec("git commit -m \"heroku\"");
shell.exec("git push heroku master");
