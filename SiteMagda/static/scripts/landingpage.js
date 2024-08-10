const headerSVG = document.getElementById('headerbackground');

window.addEventListener('scroll', () => {
const scrollPosition = document.documentElement.scrollTop;
console.log(scrollPosition);


    if (scrollPosition > 5 ){
        headerSVG.style.opacity = '1';

    }else{
        headerSVG.style.opacity = '0.35';
    }

});