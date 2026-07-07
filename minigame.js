const play = document.getElementById("play");

const notif = document.getElementById("notif");

const sound = document.getElementById("notifSound");

play.addEventListener("click", function(){

    // Delay 0,8 detik sebelum muncul
    setTimeout(function(){

        notif.classList.add("show");

        sound.play();

        setTimeout(function(){

            notif.classList.remove("show");

        },4000);

    },800);

});