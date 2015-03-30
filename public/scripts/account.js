$(document).ready(function() {

	var myUser = $("#username")[0].innerHTML;

	$("#editform").on("submit", function(e) {
		var updateData = {};
		if ($("#first_name").val()) { updateData.first_name = $("#first_name").val();}
		if ($("#last_name").val()) { updateData.last_name = $("#last_name").val();}
		if ($("#phone_number").val()) { updateData.phone_number = $("#phone_number").val();}
		if ($("#email").val()) { updateData.email = $("#email").val();}

		$.ajax({
			url: "http://localhost:3000/api/accounts/" + myUser,
			method: "PUT",
			data: updateData,
			success: function() {
    			window.location.reload(true);
			}
		});
	});

	$("#awayform").on("submit", function(e) {
		var updateData = {};
		var currentDate = new Date();
		var currentMonth = currentDate.getMonth();
		var currentYear = currentDate.getFullYear();

		$.ajax({
			url: "http://localhost:3000/api/accounts/" + myUser + "/desk/" + currentYear + "/" + currentMonth,
			method: "PUT",
			data: {status: "away"},
			success: function() {
    			window.location.reload(true);
			}
		});
	});

	$("#deleteform").on("submit", function(e) {
		$.ajax({
			url: "http://localhost:3000/api/accounts/" + myUser,
			method: "DELETE",
			success: function() {
    			window.location.reload(true);
			}	
		});
	});
});
