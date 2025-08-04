const menuToggle = document.getElementById("menu-toggle");
const header = document.querySelector(".headerContainer");
const body = document.body;

menuToggle.addEventListener("click", () => {
    header.classList.toggle("open");
    body.classList.toggle("menu-open");
    menuToggle.classList.toggle("slide")
});

window.addEventListener('scroll', function () {
    const searchBarBackground = document.getElementById('search-bar-background');
    const searchBar = document.getElementById('menu-toggle');
    console.log("1")

    if (window.scrollY > 10) {
        console.log("2")
        searchBarBackground.classList.add('scrolled-header');
        searchBar.classList.add('scrolled-helper');

    } else {
        console.log("3")
        searchBarBackground.classList.remove('scrolled-header');
        searchBar.classList.remove('scrolled-helper');
    }
});