var db = require('../models/accounts');
var moment = require('moment');
var messages = require('../messages/messages');

function deskDemand(agenda) {

	// checks for unpaid status on the first of the month
	agenda.define('deskDemand', function(job, done){
		if (moment().date() === 1) {
			var month = moment().month();
			var year = moment().year();
			var deskQueryYear = 'desk_rental_status.' + year;
			var deskQueryMonth = 'desk_rental_status.' + year + '.' + month;
			// send reminder if desk_rental_status for year missing, or if this month = 'unpaid'
			db.search({query: { $or: [
				// QUERY ONE comma
				{ $and: [ {deskQueryYear: {'$exists': false}}, {desk_authorization: true} ]},
				{ $and: [ {deskQueryMonth: 'unpaid'}, {desk_authorization: true} ]}
			]}}, function(err, result){

			});
		}
	});
}

module.exports = {
	deskDemand: deskDemand
};



