
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	setCookie("page", $(this).data('id'), 2);
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		},
		duration: 800,
		complete: function(){
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	setCookie("page", $(this).data('id'), 2);
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function(){
	var name = $("input[name='name']").val();
	var second_name = $("input[name='second_name']").val();
	var phone = $("input[name='phone']").val();
	var address = $("input[name='address']").val();
	var comment = $("textarea[name='comment']").val();
	$.ajax({
		url: requestPath,
		type: "POST",
		data: {name: name, second_name: second_name, phone: phone, address: address, comment: comment},
		async: true,
		success: function (data) {
			if(typeof data == "string") {
				$("#feed_back").html(data);
			} else {
				$("#result_title").html("Sorry, something went wrong!");
				$("#result_body").html("Ooops! Code: "+data);
			}
			$("#next_result").click();
		}
	});
})

$(".input_data").focusout(function () {
	setCookie(this.name, this.value, 2);
})

$(document).ready(function () {
	for(var i = 0; i < $(".input_data").length; i++){
		$(".input_data")[i].value = getCookie($(".input_data")[i].name);
	}

	let p = getCookie("page") -2
	if(p >= 0) {
		switch (p) {
			case 0:
				$(".next")[p].click();
				break;
			case 1:
				$("#first_field").attr('style', 'transform: scale(0.8); opacity: 0; display: none;');
				$(".next")[p].click();
				$("#progressbar li").eq(1).addClass("active");
				break;
		}
	}
})



function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
