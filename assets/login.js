var login = (function (lightdm, $) {
    var selected_user = null;
    var password = null;


    // animation functions
    function animLoginFailure(username) { // shake focused element on login failure
        document.getElementById(username+"-pass").value = "";
        $("#"+username+"-card").animate({left: '5px'}, 75);
        $("#"+username+"-card").animate({left: '-5px'}, 75);
        $("#"+username+"-card").animate({left: '5px'}, 75);
        $("#"+username+"-card").animate({left: '-5px'}, 75);
        $("#"+username+"-card").animate({left: '0px'}, 75);
    }
    function animLoginSuccess() { // fade to black on login success
        $("#bloverlay").css('visibility', 'visible');
        $("#bloverlay").animate({opacity: "1"}, 250);
    }
	function animInit() { // fade from black after init functions are run
		$("#bloverlay").animate({opacity: "0"}, 250);
		setTimeout(function(){$("#bloverlay").css('visibility', 'hidden');}, 250);
	}
    function animUnfocus(id){ // unfocus element when something else is selected
        $("#"+id).addClass('deselect-shadow');
        $("#"+id).on('animationend', function(){
            document.getElementById(id).style.boxShadow = "0px 0px 5px rgba(0,0,0,0.5)";
            $("#"+id).removeClass('deselect-shadow');
        });
    }
	function animFocus(id){ // focus element on click
        $("#"+id).addClass('select-shadow');
        $("#"+id).on('animationend', function(){
            document.getElementById(id).style.boxShadow = "0px 0px 30px rgba(0,0,0,0.5)";
            $("#"+id).removeClass('select-shadow');
        });
	}


	// private functions
    var changeUser = function(username){
        if(lightdm._username){
            lightdm.cancel_authentication();
        }
        selected_user = username;
        if(selected_user !== null){
            window.start_authentication(selected_user);
        }
        document.getElementById(selected_user+"-pass").focus();
    }
	var setupPage = function(){
		for (var i = 0; i < lightdm.users.length; i++) (function(i){
			var username = lightdm.users[i].name;
			var dispname = lightdm.users[i].display_name;
			var imglink = lightdm.users[i].image;
            if((imglink === "") || (imglink === null)) {
                imglink = "assets/profile.png";
            }
            $("#container").append("<div class='card' id='"+username+"-card'><img src='"+imglink+"' class='profile-img' id='"+username+"-img'><form><input id='"+username+"-pass' placeholder='Password' type='password' tabindex='1' class='password-box'><button type='submit' tabindex='-1' class='submit-button'></form></div>");
            document.getElementById(lightdm.users[i].name+"-card").onclick = function() {
                if(selected_user !== lightdm.users[i].name){
                    document.getElementById(selected_user+"-pass").value = "";
                    animUnfocus(selected_user+"-card");
                    animFocus(lightdm.users[i].name+"-card");
                    changeUser(lightdm.users[i].name);
                }
            }
            document.getElementById(lightdm.users[i].name+"-pass").onfocus = function() {
                if(selected_user !== lightdm.users[i].name){
                    document.getElementById(selected_user+"-pass").value = "";
                    animUnfocus(selected_user+"-card");
                    animFocus(lightdm.users[i].name+"-card");
                    changeUser(lightdm.users[i].name);
                }
            }
		})(i);
        changeUser(lightdm.users[0].name);
		animInit();
        setTimeout(function(){animFocus(selected_user+"-card");}, 250);
	}

    document.getElementById('body').onclick = function(target) {
        var runfocus = true;
        for (var i = 0; i < lightdm.users.length; i++){
            if ((target.toElement.id === lightdm.users[i].name+"-card") || (target.toElement.id === lightdm.users[i].name+"-img") || (target.toElement.id === lightdm.users[i].name+"-pass")){
                runfocus = false;
            }
        }
        if(runfocus){document.getElementById(selected_user+"-pass").focus();}
    }



    // Functions that lightdm needs
    window.start_authentication = function (username) {
        lightdm.cancel_timed_login();
        lightdm.start_authentication(username);
    };
    window.provide_secret = function () {
        password = document.getElementById(selected_user+"-pass").value || null;

        if(password !== null) {
            lightdm.provide_secret(password);
        }
    };
    window.authentication_complete = function () {
        if (lightdm.is_authenticated) {
            animLoginSuccess();
            setTimeout(function(){
                show_prompt('Logged in');
                lightdm.login(lightdm.authentication_user,lightdm.default_session);
            }, 350);
        }else{
            animLoginFailure(selected_user);
            changeUser(selected_user);
        }
    };
    // These can be used for user feedback
    window.show_error = function (e) {
        console.log('Error: ' + e);

    };
    window.show_prompt = function (e) {
        console.log('Prompt: ' + e);
    };

    // exposed outside of the closure
    var init = function () {
        $(function () {
			setupPage();

            $('form').on('submit', function (e) {
                e.preventDefault();
                setTimeout(function(){window.provide_secret();},500);
            });
        });
    };

    return {
        init: init
    };
} (lightdm, jQuery));

login.init();
