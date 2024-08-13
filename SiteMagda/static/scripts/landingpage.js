const headerSVG = document.getElementById('rectangle');

window.addEventListener('scroll', () => {
const scrollPosition = document.documentElement.scrollTop;
const opacity = Math.max(0, Math.min(1, (scrollPosition/800))).toString()
console.log(scrollPosition);


    if (scrollPosition > 800 ){
        headerSVG.style.opacity = '1';

    }else{
        headerSVG.style.opacity = opacity;
    }

});