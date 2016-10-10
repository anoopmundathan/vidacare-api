'use strict';

$(document).ready(function () {

	$('form').submit(function (e) {
		e.preventDefault();

		// Store values from the fields
		var email = $("#email").val();
		var password = $("#password").val();  

		// If user enter all required fields, then proceed further
		if (email !== '' && password !== '') {

			// Remove Login form from the DOM
			$('form').remove();

			var url = "https://vida-core-production.herokuapp.com/api/";
			var data = { 
				"api_user": { 
					"email" : email, 
					"password" : password 
				} 
			};
			// Ajax POST request to get API token
			$.ajax({
	    		type: "POST",
	    		url: url + "sessions",
	    		data: data,

	    	success: function (response){
		    	var token = response.data.attributes.token;
		    	var headers = { 
		    		"x-user-email": email, 
		    		"x-user-token": token 
		    	};

		    	// Ajax GET request to get list of clients
			    $.ajax({
					type: "GET",
			    	url: url + "clients",
			    	headers: headers,
			    	success: function (response){
			    		var responseText = "<h2 class='list-of-clients'>List of clients</h2><ul>";
			    		$.each(response.data, function(index, client) {
			    			responseText +=  "<li id=" + client.id + "><a href='#'>" + client.attributes["first-name"] + "<br>" + 
			    										 client.attributes["email"] + "<br>" +
			    										 client.attributes["primary-phone"] + "</a></li>";
			    			});
			    			
			    			$('.clients').append(responseText);

			    			// When user clicks any client, make ajax request to get full detail of the client
			    			$('li').click(function (e) {
			    				e.preventDefault();

			    				var id = $(this).attr('id');

			    				// Ajax GET request to get detail of specific client
			    				$.ajax({
									type: "GET",
			    					url: url + "clients/" + id,
			    					headers: headers,
		  							success: function (response) {

		  								// Hide List of clients and remove any previously created client details.
		  								$('.clients').hide();
		  								$('.client').remove();

		  								var responseText = "<div class='client'>";
		  								responseText += "<a href='#'<i class='material-icons'>arrow_back</i> <span class='back'></span></a>";

		  								$.each(response.data.attributes, function(index, client) {
		  									responseText += "<h2 class='client-data'>" + index + " : " + client +"</h2>";
		  								});
		  								responseText += "</div>";

		  								$('.container').append(responseText);

		  								// Go back button
		  								$('.client a').click(function (e) {
		  									e.preventDefault();
		  									$('.client').remove();
		  									$('.clients').show();
		  								}); // End of go back click
		  							}
		  						}); // End of ajax
			    			}); // End of list
			    		}
					}); // End of ajax request for clients
			    }, 

			    // If Ajax request failed, display message in console and alert user.
			    error: function(jqXHR, textStatus, errorThrown) {
  					console.log(textStatus, errorThrown);
  					$('body').append('<h2>Something wrong with Request</h2>')
				}
			}); // End of ajax request for API token
		} else { 
			alert('Login is not correct');
		}// End of if condition
	}); // End of form submit function
}); // End of document ready function