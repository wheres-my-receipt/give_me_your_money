exports.test = function(agenda) {
	agenda.define('helloWorld', function(job, done){
		console.log('Hello World!');
		done();
	});
};
