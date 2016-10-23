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
