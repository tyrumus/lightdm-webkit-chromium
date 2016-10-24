function drawTime(){
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    if(m<10){m = "0"+m;}
    if(h<10){h = "0"+h;}
    document.getElementById('clock').innerHTML = h+":"+m;
}
drawTime();
window.onload = function(){setInterval('drawTime()', 1000);}


//widget-menu
var w = window.innerWidth;
var h = window.innerHeight;
var menuOpen = false;
window.onresize = function(){
    w = window.innerWidth;
    h = window.innerHeight;
}
function openMenu(){
    menuOpen = true;
    $("#widget").css('backgroundColor', '#3871d5');
    $("#widget-menu").css({visibility:'visible',opacity:'1'});
}
function closeMenu(){
    $("#widget").css('backgroundColor', 'rgba(0,0,0,0.7)');
    $("#widget-menu").animate({opacity: '0'}, 100);
    setTimeout(function(){$("#widget-menu").css('visibility', 'hidden');}, 100);
    menuOpen = false;
}
document.onclick = function(event){
    var x = event.clientX;
    var y = event.clientY;
    // menu open and close
    if((x <= w) && (x >= w-82) && (y <= h) && (y >= h-44) && (!menuOpen)){
        openMenu();
    }else if(menuOpen){
        if((x < w-310) || (y < h-346) || (y > h-42)){
            closeMenu();
        }
    }
}
