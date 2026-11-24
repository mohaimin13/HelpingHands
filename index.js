
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navButtons = document.querySelector(".nav-buttons");
    const currentYear = document.getElementById("currentYear");

   
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
        navButtons.classList.toggle("active");
    });

 
    const links = navLinks.querySelectorAll("a");

    links.forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            navButtons.classList.remove("active");
        });
    });

    
    currentYear.textContent = new Date().getFullYear();

});
