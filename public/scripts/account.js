$("#editform").on("submit", function(e) {
	e.preventDefault();

	var updateData = {};
	if ($("#first_name").val()) { updateData.first_name = $("#first_name").val();}
	if ($("#last_name").val()) { updateData.last_name = $("#last_name").val();}
	if ($("#phone_number").val()) { updateData.phone_number = $("#phone_number").val();}
	if ($("#email").val()) { updateData.email = $("#email").val();}
	if ($("#checked").val()) { updateData.desk_authorization = $("#checked").val();}

	$.ajax({
		url: "http://localhost:3000/api/accounts/MIJOTHY",
		method: "PUT",
		data: updateData,
		success: function(response, status) {
			console.log(response);
			$("#successorfailure").hidden = false;
		}
	});
});

$("#deleteform").on("submit", function(e) {
	$.ajax({
		url: "http://localhost:3000/api/accounts/MIJOTHY",
		method: "DELETE",
		success: function(response) {
			console.log(response);
		}
	});
});
