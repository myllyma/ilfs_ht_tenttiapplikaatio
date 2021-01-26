const shell = require("shelljs");

shell.rm("-rf", "build");
shell.cd("../frontend");
shell.exec("npm run build");
shell.mv("build", "../backend");