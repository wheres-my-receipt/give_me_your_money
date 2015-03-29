var gulp 	= require("gulp");
var lab 	= require("gulp-lab");
var exec 	= require('child_process').exec;

function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  };
}

gulp.task("start-local-mongo", runCommand('mongod --dbpath ./data/ --port 9000'));

gulp.task("stop-local-mongo", runCommand("mongod --dbpath ./data/ --shutdown"));

gulp.task("lab", function (){
    return gulp.src("test/*.js")
      .pipe(lab(["-v"])); //-v shows all the passed tests as well as failed ones, -l hides global variable leaks, -c test coverage
});

gulp.task("watch-lab", function() {
	gulp.watch(["test/**.js", "api/**.js"], ["lab"]);
});

gulp.task("default", ["lab", "watch-lab"]);