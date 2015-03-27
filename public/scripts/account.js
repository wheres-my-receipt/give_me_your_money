$(document).ready(function() {

	var myUser = $("#username")[0].innerHTML;

	$("#editform").on("submit", function(e) {
		e.preventDefault();
		var updateData = {};
		if ($("#first_name").val()) { updateData.first_name = $("#first_name").val();}
		if ($("#last_name").val()) { updateData.last_name = $("#last_name").val();}
		if ($("#phone_number").val()) { updateData.phone_number = $("#phone_number").val();}
		if ($("#email").val()) { updateData.email = $("#email").val();}

		$.ajax({
			url: "http://localhost:3000/api/accounts/" + myUser,
			method: "PUT",
			data: updateData,
			success: function(response) {
				console.log(response);
				var url = "/account";
				$(location).attr('href',url);
			}
		});
	});

	$("#deleteform").on("submit", function(e) {
		e.preventDefault();
		$.ajax({
			url: "http://localhost:3000/api/accounts/" + myUser,
			method: "DELETE",
			success: function(response) {
				var url = "/logout";
				$(location).attr('href',url);
			}
		});
	});
});
