const headerSVG = document.getElementById('header');
let originalPos = true;
let lastScroll = 0;

window.addEventListener('scroll', () => {

    const viewheight = window.innerHeight - headerSVG.offsetHeight;
    const scrollPosition = document.documentElement.scrollTop;
    const opacity = Math.max(0, Math.min(1, (scrollPosition/viewheight))).toString();

    if(scrollPosition < lastScroll) {
        // Header opacity change
        if (scrollPosition > viewheight) {

            headerSVG.style.backgroundColor = 'rgba(41,44,47,1)';
        } else {
            headerSVG.style.backgroundColor = 'rgba(41,44,47,' + opacity + ')';
        }
        // Scroll Down Animation Trigger
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


/* .lead-section Animation */
document.querySelectorAll('.clickable').forEach(item => {item.addEventListener('click', function (){
    const movableDiv = document.querySelector('.onTop');
    if (originalPos){
        movableDiv.style.transition = 'all ease-in-out 1s'
        movableDiv.style.transform = 'translate(100%)'
    }else{
        movableDiv.style.transform = 'translate(0)'
    }
    originalPos = !originalPos;
    });
});

/* .feedback-scroll-container Behavior */


const feedbackSlider = document.getElementById('feedback-scroll-container');
const scrollRightButton = document.getElementById('scrollRight');
const scrollLeftButton = document.getElementById('scrollLeft');
const feedbackData = [ // Feedbacks array
    {
      text: "A Magda foi incansável no processo, tanto na procura como durante a aquisição, com grande profissionalismo sempre simpática, disponível e nos momentos mais críticos teve sempre uma palavra amiga.",
      author: "Rosário Sousa"
    },
    {
      text: "Incansáveis. Sempre que a bola está do lado da Equipa da Magda Leal, rapidamente o assunto é tratado. [...]Nunca uma chamada da nossa parte ficou por atender. Não se pode pedir mais..",
      author: "Silvana Curado"
    },
    {
      text: "Uma agente imobiliária impecável! Não só é uma excelente profissional como também é uma amiga que se preocupa genuinamente com os seus clientes.",
      author: "Catarina Cardoso"
    },
    {
      text: "Profissionalismo, dedicação, seriedade e simpatia! Tornou todo o complexo processo da compra de uma casa, em algo muito simples, onde tudo o que foi prometido, foi cumprido! E com uma rapidez fantástica!",
      author: "Carlos Silva"
    },
    {
      text: "Tive a minha casa à venda durante cerca de dois anos e meio noutra imobiliária. Quando, felizmente, mudei para a Magda, foram 23 dias para a vender! Só lamento não o ter feito antes. [...]",
      author: "Sílvia Fernandes"
    },
    {
      text: "As a Foreign national living abroad it can be extremely difficult to purchase property in Portugal [...].  Magda’s team was able to get it done!  Magda is a true professional with all of the necessary tools to close a deal.[...]",
      author: "Sérgio Serpa"
    }];
const originalLength = feedbackData.length;
let currentLength = feedbackData.length;
let currentPosition = Math.ceil(feedbackData.length/2 - 1);
const quoteImageUrl = "{% static 'landingpage/quote.png' %}";



// Initiate the slider in the middle feedback
window.addEventListener('load', () => {feedbackSlider.scrollBy({left:300})});
window.addEventListener('load', () => {feedbackSlider.scrollBy({left:300})});




scrollRightButton.addEventListener('click', ()=>{
    // Every click behaviour
    feedbackSlider.scrollBy({
        left: 300,
        behavior: 'smooth'
    });

    // If it gets close to right side border, loads another review outside the viewport
    currentPosition++;
    if(currentLength-currentPosition === 1) {
        feedbackSlider.innerHTML += `
        <div class="new-feedback" >
            <div style="width: 100%; text-align: left"><img class="property-img" src="/static/landingpage/quote.png"></div>
            <p style="margin-bottom: 0.8rem">${feedbackData.at(currentLength%originalLength).text}</p>
            <p style="color: #6c6c6c">${feedbackData.at(currentLength%originalLength).author}</p>
        </div>
      `;
        currentLength++;

        feedbackSlider.scrollBy({
        left: 300,
        behavior: 'smooth'
    });
    }
});


scrollLeftButton.addEventListener('click', ()=>{

    feedbackSlider.scrollBy({
        left: -300,
        behavior: 'smooth'
    });

    currentPosition--;

    if(currentPosition === 1) {
        let newFeedback = document.createElement('div');
        newFeedback.innerHTML = `
        <div class="new-feedback" >
            <div style="width: 100%; text-align: left"><img class="property-img" src="/static/landingpage/quote.png"></div>
            <p style="margin-bottom: 0.8rem">${feedbackData.at(originalLength - 1  - currentLength%originalLength).text}</p>
            <p style="color: #6c6c6c">${feedbackData.at(originalLength - 1  - currentLength%originalLength).author}</p>
        </div>
      `;

        feedbackSlider.insertBefore(newFeedback, feedbackSlider.firstChild);
        currentLength++;
        currentPosition++;

    }
    feedbackSlider.scrollBy({
        left: 300
    });
    feedbackSlider.scrollBy({
        left: -300,
        behavior: 'smooth'
    });
});


