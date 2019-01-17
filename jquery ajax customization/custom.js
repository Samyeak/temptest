$.fn.hello = (data) => console.log(`Hello ${data}`);

$.fn.defAppend = $.fn.append;
$.fn.append = function(data) {
	this.defAppend(`${new Date().getTime()} : ${data} <br>`);
}


$("button").on('click', ()=> {
	$.ajax({
  		url : "https://reqres.in/api/login",
  		success: (data)=> {
  			$( ".result" ).append(JSON.stringify(data));
  		},
  		crossOrigin: true,
  		method: "GET",
  		headers: {
  			'noXPC': '?'
  		},
  		beforeSend: function (xhr) {
  			xhr.setRequestHeader('overrideBeforeSend', '??')
  		}
	});
});

$(document).ajaxSuccess(function(success, statusText, jqXHR) {
  $( ".log" ).append( `Triggered global ajaxSuccess handler` );
  return;
});