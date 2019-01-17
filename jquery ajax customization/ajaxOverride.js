headerValue = "custom";


$.ajaxSetup({
	headers: {
		'xpcToken': headerValue || '5k87djl393ld9as4l9'
	},
	beforeSend: function (xhr) {
		//MEMOSA: It is overridden when beforeSend is specified in ajax request
		xhr.setRequestHeader('beforeSend', headerValue);
	}
})