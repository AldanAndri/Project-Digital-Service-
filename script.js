
const tombol = document.getElementById("mulai");

tombol.addEventListener("click", function(){

    document.body.style.opacity = "0";

    setTimeout(function(){

        window.location.href = "about.html";

    }, 1000);

});