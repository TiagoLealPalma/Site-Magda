const menuToggle = document.getElementById("menu-toggle");
const header = document.querySelector(".headerContainer");
const body = document.body;
const mq = window.matchMedia("(min-width: 768px)");

const headerSVG = document.getElementById('header');
let originalPos = true;
let lastScroll = 0;
let downScrolling = false;
let upScrolling = false;

window.addEventListener('scroll', () => {



    const viewheight = window.innerHeight - headerSVG.offsetHeight;
    const scrollPosition = document.documentElement.scrollTop;
    const opacity = Math.max(0, Math.min(1, ((scrollPosition/viewheight)/10))).toString();

    // General styling


     const elements = document.querySelectorAll('.hidden');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });


    if (!mq.matches) return;

    // Desktop only styling

    if(scrollPosition < lastScroll) { // Scrolling up
        downScrolling = false;
        if (!upScrolling){
            headerSVG.style.transform = 'translateY(0px)'
        }

        if (scrollPosition > viewheight) {
            headerSVG.style.backgroundColor = 'rgba(255, 255, 255,0.1)';
        } else {
            headerSVG.style.backgroundColor = 'rgba(255, 255, 255,' + opacity + ')';
            headerSVG.style.boxShadow = 'none';
        }
        headerSVG.style.opacity = '1';

    } else { // Scrolling down
        upScrolling = false;
        if(!downScrolling){
            headerSVG.style.transform = 'translateY(-200px)';
            downScrolling = true;
        }
    }

    lastScroll = scrollPosition;


});

document.querySelectorAll('.clickable').forEach(item => {
    item.addEventListener('click', function (){
        const movableDiv = document.querySelector('.onTop');
        if (originalPos){
            movableDiv.style.transition = 'all ease-in-out 1s'
            movableDiv.style.transform = 'translate(100%)'
        } else {
            movableDiv.style.transform = 'translate(0)'
        }
        originalPos = !originalPos;
    });
});

const feedbacks = [
  {
    text: "A Magda foi incansável no processo, tanto na procura como durante a aquisição, com grande profissionalismo sempre simpática, disponível e nos momentos mais críticos teve sempre uma palavra amiga.",
    author: "Rosário Sousa"
  },
  {
    text: "Incansáveis. Sempre que a bola está do lado da Equipa da Magda Leal, rapidamente o assunto é tratado. Nunca uma chamada da nossa parte ficou por atender. Não se pode pedir mais.",
    author: "Silvana Curado"
  },
  {
    text: "Uma agente imobiliária impecável! Não só é uma excelente profissional como também é uma amiga que se preocupa genuinamente com os seus clientes.",
    author: "Catarina Cardoso"
  },
  {
    text: "Profissionalismo, dedicação, seriedade e simpatia! Tornou todo o processo de compra de casa simples e rápido!",
    author: "Carlos Silva"
  },
  {
    text: "Vendi em 23 dias depois de mais de dois anos noutra imobiliária. A Magda faz mesmo a diferença!",
    author: "Sílvia Fernandes"
  }
];

const carousel = document.getElementById('feedback-carousel');
let currentIndex = 0;

// Criar os slides
feedbacks.forEach((f, i) => {
  const slide = document.createElement('div');
  slide.classList.add('feedback-slide');
  slide.innerHTML = `
    <div style="text-align: left; margin-bottom: 1rem;">
      <img class="feedback-quote" src="/static/landingpage/quote.png" >
    </div>
    <p style="margin-bottom: 0.8rem">${f.text}</p>
    <p style="color: #6c6c6c"><strong>${f.author}</strong></p>
  `;
  carousel.appendChild(slide);
});

const updateSlides = () => {
  const slides = document.querySelectorAll('.feedback-slide');
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'left', 'right');
    if (i === currentIndex) {
      slide.classList.add('active');
    } else if (i === (currentIndex + 1) % feedbacks.length) {
      slide.classList.add('right');
    } else if (i === (currentIndex - 1 + feedbacks.length) % feedbacks.length) {
      slide.classList.add('left');
    }
  });
};

updateSlides();

// Rotação automática
setInterval(() => {
  currentIndex = (currentIndex + 1) % feedbacks.length;
  updateSlides();
}, 4000);


menuToggle.addEventListener("click", () => {
    header.classList.toggle("open");
    body.classList.toggle("menu-open");
    menuToggle.classList.toggle("slide")
});


const logo = document.getElementById("logo");
const nav = document.getElementById("nav-links");
const triggerHeight = window.innerHeight; // 100vh in px

window.addEventListener("scroll", () => {
  if (window.scrollY > triggerHeight) {
    logo.classList.add("secondary-color");
    nav.classList.add("black-color");
  } else {
    logo.classList.remove("secondary-color");
    nav.classList.remove("black-color");
  }
});