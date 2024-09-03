const headerSVG = document.getElementById('header');
let originalPos = true;
let lastScroll = 0;

window.addEventListener('scroll', () => {
    /* Fade Header Bar */
    const viewheight = window.innerHeight - headerSVG.offsetHeight;
    const scrollPosition = document.documentElement.scrollTop;
    const opacity = Math.max(0, Math.min(1, (scrollPosition/viewheight))).toString();
    const scrollDirection = lastScroll - scrollPosition;

    if(scrollDirection > -1){
        if (scrollPosition > viewheight) {
            headerSVG.style.backgroundColor = 'rgba(41,44,47,1)';
            console.log("entrei 1")
        }else {
            headerSVG.style.backgroundColor = 'rgba(41,44,47,' + opacity + ')';
            console.log("entrei 0")
        }
        headerSVG.style.opacity = '1';
    }else{
        headerSVG.style.opacity = '0';
    }

    lastScroll = scrollPosition;

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

document.querySelectorAll('.clicable').forEach(item => {item.addEventListener('click', function (){
    const movableDiv = document.querySelector('.onTop');
    if (originalPos){
        movableDiv.style.transition = 'all ease-in-out 1s'
        movableDiv.style.transform = 'translate(100%)'
        console.log("entrei")
    }else{
        movableDiv.style.transform = 'translate(0)'
    }
    originalPos = !originalPos;
    });
});

