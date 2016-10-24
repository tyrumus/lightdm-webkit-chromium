var login = (function (lightdm, $) {
    var selected_user = null;
    var selected_user_id = null;
    var password = null;
    var session_id = null;


    // animation functions
    function addForm(user){
        $("#"+user+"-card").append("<form id='"+user+"-form'><input id='"+user+"-pass' placeholder='Password' type='password' tabindex='1' class='password-box'><button type='submit' tabindex='-1' class='submit-button'></form>");
        document.getElementById(user+"-form").onsubmit = function(e){
            e.preventDefault();
            setTimeout(function(){window.provide_secret();},500);
        }
    }
    function addName(user, name){
        $("#"+user+"-card").append("<div class='name-box' id='"+user+"-name'>"+name+"</div>");
    }
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
    function animUnfocus(user,id){ // unfocus element when something else is selected
        $("#"+user+"-card").addClass('deselect-shadow');
        $("#"+user+"-card").on('animationend', function(){
            document.getElementById(user+"-card").style.boxShadow = "0px 0px 5px rgba(0,0,0,0.5)";
            $("#"+user+"-card").removeClass('deselect-shadow');
        });
        $("#"+user+"-form").remove();
        addName(user,lightdm.users[id].display_name);
    }
	function animFocus(user){ // focus element on click
        $("#"+user+"-card").addClass('select-shadow');
        $("#"+user+"-card").on('animationend', function(){
            document.getElementById(user+"-card").style.boxShadow = "0px 0px 30px rgba(0,0,0,0.5)";
            $("#"+user+"-card").removeClass('select-shadow');
        });
        $("#"+user+"-name").remove();
        addForm(user);
	}


	// private functions
    var changeSession = function(id){
        $("#"+session_id+"-check").css('visibility', 'hidden');
        $("#"+id+"-check").css('visibility', 'visible');
        session_id = id
    }
    var changeUser = function(username,id){
        if(lightdm._username){
            lightdm.cancel_authentication();
        }
        selected_user = username;
        selected_user_id = id;
        if(selected_user !== null){
            window.start_authentication(selected_user);
        }
    }
	var setupPage = function(){
		for (var i = 0; i < lightdm.users.length; i++) (function(i){
			var username = lightdm.users[i].name;
			var dispname = lightdm.users[i].display_name;
			var imglink = lightdm.users[i].image;
            if((imglink === "") || (imglink === null)) {
                imglink = "assets/profile.png";
            }
            $("#container").append("<div class='card' id='"+username+"-card'><img src='"+imglink+"' class='profile-img' id='"+username+"-img'><div class='name-box' id='"+username+"-name'>"+dispname+"</div></div>");
            document.getElementById(lightdm.users[i].name+"-card").onclick = function() {
                if(selected_user !== lightdm.users[i].name){
                    document.getElementById(selected_user+"-pass").value = "";
                    animUnfocus(selected_user,selected_user_id);
                    changeUser(lightdm.users[i].name,i);
                    animFocus(lightdm.users[i].name);
                    document.getElementById(selected_user+"-pass").focus();
                }
            }
		})(i);
        //setup sessions
        session_id = 0;
        for (var i = 0; i < lightdm.sessions.length; i++) (function(i){
            $("#widget-container").append("<div class='widget-entry' id='"+i+"-s'>"+lightdm.sessions[i].name+"<i id='"+i+"-check' class='checkmark'></i></div>");
            document.getElementById(i+'-s').onclick = function(){
                changeSession(i);
            }
        })(i);
        $("#0-check").css('visibility', 'visible');


        changeUser(lightdm.users[0].name,0);
        animFocus(lightdm.users[0].name);
        document.getElementById(lightdm.users[0].name+"-pass").focus();
        setTimeout(function(){animInit();}, 500);
	}

    document.getElementById('body').onclick = function(target) {
        var runfocus = true;
        for (var i = 0; i < lightdm.users.length; i++){
            if (target.toElement.id === lightdm.users[i].name+"-pass"){
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
                lightdm.login(lightdm.authentication_user,lightdm.sessions[session_id]);
            }, 350);
        }else{
            animLoginFailure(selected_user,selected_user_id);
            changeUser(selected_user,selected_user_id);
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
        });
    };

    return {
        init: init
    };
} (lightdm, jQuery));

login.init();
