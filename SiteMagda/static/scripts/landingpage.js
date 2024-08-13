const headerSVG = document.getElementById('rectangle');

window.addEventListener('scroll', () => {

    /* Fade Header Bar */
    const scrollPosition = document.documentElement.scrollTop;
    const opacity = Math.max(0, Math.min(1, (scrollPosition/800))).toString()
    console.log(scrollPosition);

    if (scrollPosition > 800 ){
        headerSVG.style.opacity = '1';
    }else{
        headerSVG.style.opacity = opacity;
    }

    /* Fade in elements */
    const elements = document.querySelectorAll('.hidden');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
});

