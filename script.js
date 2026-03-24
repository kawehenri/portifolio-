/* ============================================================
   PORTFÓLIO — script.js
   Funcionalidades:
     1. Navbar scroll (fundo + active link)
     2. Menu mobile (hamburger)
     3. Efeito de digitação no título
     4. Animações de entrada via IntersectionObserver
     5. Barras de habilidade animadas
     6. Botão "voltar ao topo"
     7. Formulário de contato com feedback
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. NAVBAR — fundo ao rolar
────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();


/* ──────────────────────────────────────────────
   2. ACTIVE LINK — destacar seção visível
────────────────────────────────────────────── */
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');

function updateActiveLink() {
  let currentId = '';
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ──────────────────────────────────────────────
   3. MENU MOBILE — hamburger toggle
────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Fechar menu ao clicar em um link */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* Fechar menu ao clicar fora */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


/* ──────────────────────────────────────────────
   4. EFEITO DE DIGITAÇÃO
────────────────────────────────────────────── */
const typedEl = document.getElementById('typed-text');

const phrases = [
  'Engenheiro de Software',
  'Desenvolvedor Full Stack',
  'Apaixonado por tecnologia',
  'Python · PHP · Laravel · React',
  'Construindo soluções reais',
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let typingPaused = false;

const TYPING_SPEED   = 70;   // ms por caractere ao digitar
const DELETING_SPEED = 35;   // ms por caractere ao apagar
const PAUSE_AFTER    = 2000; // ms de pausa ao fim da frase
const PAUSE_BEFORE   = 400;  // ms de pausa antes de começar a apagar

function typeWriter() {
  if (typingPaused) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typedEl.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeWriter, PAUSE_BEFORE);
      return;
    }
    setTimeout(typeWriter, DELETING_SPEED);
  } else {
    charIndex++;
    typedEl.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === currentPhrase.length) {
      typingPaused = true;
      setTimeout(() => {
        typingPaused = false;
        isDeleting = true;
        typeWriter();
      }, PAUSE_AFTER);
      return;
    }
    setTimeout(typeWriter, TYPING_SPEED);
  }
}

/* Inicia o efeito após um pequeno delay */
setTimeout(typeWriter, 800);


/* ──────────────────────────────────────────────
   5. ANIMAÇÕES DE ENTRADA — IntersectionObserver
────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ──────────────────────────────────────────────
   6. BARRAS DE HABILIDADE — animar ao revelar
────────────────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = fill.dataset.width || '0';
        /* Pequeno delay para a animação aparecer após o reveal */
        setTimeout(() => {
          fill.style.width = `${target}%`;
        }, 200);
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-fill').forEach(el => {
  skillObserver.observe(el);
});


/* ──────────────────────────────────────────────
   7. BOTÃO VOLTAR AO TOPO
────────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────────────────
   8. FORMULÁRIO DE CONTATO — feedback visual
────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  /* Validação simples */
  if (!name || !email || !message) {
    showFeedback('Por favor, preencha todos os campos.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFeedback('Informe um e-mail válido.', 'error');
    return;
  }

  /* Simulação de envio — substitua por fetch() para integração real */
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';

  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensagem';
    showFeedback('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
  }, 1200);
});

function showFeedback(msg, type) {
  formFeedback.textContent = msg;
  formFeedback.className = `form-feedback ${type}`;
  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';
  }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ──────────────────────────────────────────────
   9. SCROLL SUAVE — links internos
   (reforço além do scroll-behavior: smooth do CSS)
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
