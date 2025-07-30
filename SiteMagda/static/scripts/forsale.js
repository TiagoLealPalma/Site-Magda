const menuToggle = document.getElementById("menu-toggle");
const header = document.querySelector(".headerContainer");
const body = document.body;

menuToggle.addEventListener("click", () => {
    header.classList.toggle("open");
    body.classList.toggle("menu-open");
    menuToggle.classList.toggle("slide")
});