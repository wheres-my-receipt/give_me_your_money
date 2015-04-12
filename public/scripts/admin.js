$(document).ready(function() {

	var myUser = $("#username")[0].innerHTML;

	$("#adminedit").on("submit", function(e) {
		var updateData = {};
		if ($("#deskStatus").val()) {
			updateData.desk_authorization = ($("#deskStatus").val() === "active") ? true : false;
		}
		if ($("#memberStatus").val()) {
			updateData.membership_active_status = ($("#memberStatus").val()) === "active" ? true : false;
		}
		console.log( 'updateData: ' + JSON.stringify( updateData ));
		$.ajax({
			url: "http://localhost:3000/admin/member/" + myUser,
			method: "PUT",
			data: updateData,
			success: function() {
    			window.location.reload(true);
			}
		});
	});
});
