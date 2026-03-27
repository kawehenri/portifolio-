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
     8. Scroll suave — âncoras internas
     9. Modal de detalhes dos projetos
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
  'Desenvolvedor full stack em formação',
  'Engenharia de Software · UDF',
  'APIs, interfaces e dados',
  'PHP · Laravel · Python · React',
  'Da especificação ao deploy',
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
   8. SCROLL SUAVE — links internos
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


/* ──────────────────────────────────────────────
   9. MODAL DE PROJETOS
────────────────────────────────────────────── */
const PROJECT_DATA = {
  aqua: {
    category: 'IoT · Web App',
    title: 'AquaFloww',
    subtitle: 'Irrigação inteligente, monitoramento e landing institucional.',
    impact: 'Meta de pesquisa: reduzir até 40% o desperdício de água e energia no cultivo.',
    context: 'Iniciação científica — hardware + software + presença web.',
    stack: 'Stack: Arduino · Python · MySQL · React Native · HTML/CSS',
    body: `<p>Plataforma de <strong>iniciação científica</strong> que une hardware (Arduino), software e presença web: automação da irrigação, monitoramento e landing institucional com narrativa técnica, benefícios, FAQ e roadmap. Objetivo central: <strong>reduzir desperdício de água e energia</strong> sem sacrificar produtividade agrícola.</p>`,
    urlLive: 'http://aquafloww.site/',
    urlCode: 'https://github.com/kawehenri/kawehenri.github.io.git',
  },
  gerenciador: {
    category: 'App desktop',
    title: 'Gerenciador de tarefas',
    subtitle: 'Python + Flet · modelo de dados em SQLite.',
    impact: '100% offline: dados persistidos localmente, sem servidor.',
    context: 'Projeto acadêmico — produtividade pessoal.',
    stack: 'Stack: Python · Flet · SQLite',
    body: `<p>Aplicação <strong>Python + Flet</strong> com modelo de dados em <strong>SQLite</strong>: categorias, prioridades e persistência local. Interface objetiva para produtividade pessoal; distribuição via ambiente de desenvolvimento — código versionado e pronto para evolução (empacotamento ou nuvem).</p>`,
    urlLive: '',
    urlCode: 'https://github.com/kawehenri/gerenciador_de_tarefas.git',
  },
  barbearia: {
    category: 'Web App · SaaS-ready',
    title: 'BarboX · gestão de barbearia',
    subtitle: 'Laravel + React · API REST com Sanctum.',
    impact: '−35% no tempo de agendamento (fluxo digital vs. manual).',
    context: 'Projeto acadêmico full stack.',
    stack: 'Stack: PHP · Laravel · React · MySQL · REST API · Sanctum',
    body: `<p>Ecossistema <strong>Laravel + React</strong> para operação de barbearia: <strong>API REST</strong> com <strong>Laravel Sanctum</strong>, regras de negócio e MySQL; painel administrativo, portal do cliente, agendamentos e cadastro de serviços. Arquitetura preparada para crescer — pagamentos, notificações e multiunidade.</p>`,
    urlLive: '',
    urlCode: 'https://github.com/kawehenri/projeto_barbearia.git',
  },
  neymar: {
    category: 'Web · PWA',
    title: 'NJR Legacy',
    subtitle: 'Site estático de alto volume informativo.',
    impact: 'Leitura mobile-first · conteúdo longform com PWA instalável.',
    context: 'Portfólio editorial e exercício de marca.',
    stack: 'Stack: HTML · CSS · JavaScript · PWA · Node (opcional)',
    body: `<p>Site estático de alto volume informativo: arquitetura multipágina, conteúdo longform, performance e <strong>PWA</strong> (manifest + service worker). Formulário de contato com backend Node opcional; layout responsivo pensado para leitura e compartilhamento — exercício de marca, SEO básico e acessibilidade.</p>`,
    urlLive: 'https://njrlegacy.gt.tc',
    urlCode: 'https://github.com/kawehenri/site_neymar.git',
  },
  myroutine: {
    category: 'Web App · PWA',
    title: 'My Routine',
    subtitle: 'SPA React + Vite — produtividade no browser.',
    impact: 'Privacidade por design: estado apenas no localStorage, sem backend.',
    context: 'Projeto autoral.',
    stack: 'Stack: React · Vite · PWA · HashRouter',
    body: `<p><strong>SPA React + Vite</strong> com módulos de cronograma, estudos, timer estilo Pomodoro, hábitos, sono, treino, metas e painéis estatísticos. Estado persistido no <kbd>localStorage</kbd> (privacidade por design), temas claro/escuro e <strong>PWA</strong> — stack enxuta, sem dependência de servidor.</p>`,
    urlLive: 'http://aquafloww.site/myroutine-/',
    urlCode: 'https://github.com/kawehenri/myroutine-.git',
  },
  ecohistory: {
    category: 'Portal educativo',
    title: 'EcoHistory',
    subtitle: 'História, quizzes e navegação multipágina.',
    impact: 'Quizzes interativos + conteúdo por era para aumentar engajamento.',
    context: 'Projeto acadêmico.',
    stack: 'Stack: HTML · CSS · JavaScript',
    body: `<p>Portal educativo multipágina para explorar <strong>acontecimentos históricos</strong> com contexto, curiosidades e navegação clara. Inclui <strong>quizzes interativos</strong>, destaques por era e um eixo especial sobre <strong>cultura pop</strong> — caso do seriado <strong>Dexter</strong> como objeto de análise — alinhado a páginas institucionais (sobre, contato, acessibilidade).</p>`,
    urlLive: 'http://aquafloww.site/EcoHistory/',
    urlCode: 'https://github.com/kawehenri/EcoHistory.git',
  },
  rr: {
    category: 'Design em código',
    title: 'RR Pimentas',
    subtitle: 'Rótulos e identidade em HTML.',
    impact: 'Peças escaláveis para impressão ou PDF com consistência de marca.',
    context: 'Cliente real / varejo gourmet.',
    stack: 'Stack: HTML · Design · Marca',
    body: `<p>Sistema de <strong>rótulos e peças gráficas em HTML</strong> para varejo de temperos e pimentas: consistência visual, escalabilidade para impressão ou exportação PDF e narrativa de marca alinhada ao posicionamento gourmet — design aplicado com rigor tipográfico e reprodutibilidade.</p>`,
    urlLive: '',
    urlCode: 'https://github.com/kawehenri/rr_pimentas.git',
  },
  curriculo: {
    category: 'Ferramenta',
    title: 'Currículos parametrizados em código',
    subtitle: 'Variantes PT/EN e pipeline para PDF.',
    impact: 'Tipografia e grid sob controle — impressão consistente.',
    context: 'Projeto autoral (inclui o meu CV).',
    stack: 'Stack: HTML · CSS · JavaScript',
    body: `<p>Modelos de CV em <strong>HTML, CSS e JavaScript</strong> (incluindo o meu), com variantes <strong>PT/EN</strong> e pipeline para <strong>PDF</strong>. Tipografia, grid e hierarquia sob controle total — alternativa profissional a editores genéricos, com foco em clareza e impressão consistente.</p>`,
    urlLive: '',
    urlCode: 'https://github.com/kawehenri/curriculo.git',
  },
  edo: {
    category: 'Conceito de produto',
    title: 'Edo Bistro',
    subtitle: 'Marketplace vertical para culinária japonesa.',
    impact: 'Validação de UX antes de escalar — wireframes e testes de interface.',
    context: 'Exploração / portfolio de produto.',
    stack: 'Stack: Conceito · Web · UX',
    body: `<p>Exploração de <strong>marketplace de reviews verticais</strong> para culinária japonesa — do sashimi ao <strong>omakase</strong>. Hipóteses de UX, taxonomia de pratos e critérios culturais; repositório concentra wireframes, protótipos e testes de interface para validar proposta antes de escalar.</p>`,
    urlLive: '',
    urlCode: 'https://github.com/kawehenri/Edo_Bistr-.git',
  },
};

const projectModal       = document.getElementById('projectModal');
const projectModalClose  = document.getElementById('projectModalClose');
const projectModalLive   = document.getElementById('projectModalLive');
const projectModalCode   = document.getElementById('projectModalCode');
const projectModalCategory = document.getElementById('projectModalCategory');
const projectModalTitle  = document.getElementById('projectModalTitle');
const projectModalSubtitle = document.getElementById('projectModalSubtitle');
const projectModalImpact = document.getElementById('projectModalImpact');
const projectModalContext = document.getElementById('projectModalContext');
const projectModalBody   = document.getElementById('projectModalBody');
const projectModalStack  = document.getElementById('projectModalStack');

let projectModalLastFocus = null;

function openProjectModal(id) {
  const d = PROJECT_DATA[id];
  if (!d || !projectModal) return;

  projectModalCategory.textContent = d.category;
  projectModalTitle.textContent = d.title;
  projectModalSubtitle.textContent = d.subtitle;
  projectModalImpact.textContent = d.impact;
  projectModalContext.textContent = d.context;
  projectModalBody.innerHTML = d.body;
  projectModalStack.textContent = d.stack;

  if (d.urlLive) {
    projectModalLive.href = d.urlLive;
    projectModalLive.hidden = false;
  } else {
    projectModalLive.hidden = true;
  }

  projectModalCode.href = d.urlCode;

  projectModalLastFocus = document.activeElement;
  projectModal.removeAttribute('hidden');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  projectModalClose.focus();
}

function closeProjectModal() {
  if (!projectModal || projectModal.hasAttribute('hidden')) return;

  projectModal.setAttribute('hidden', '');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (projectModalLastFocus && typeof projectModalLastFocus.focus === 'function') {
    projectModalLastFocus.focus();
  }
  projectModalLastFocus = null;
}

document.querySelectorAll('.js-project-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    openProjectModal(tile.dataset.project);
  });

  tile.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(tile.dataset.project);
    }
  });
});

document.querySelectorAll('.project-tile__icon-btn').forEach(link => {
  link.addEventListener('click', e => e.stopPropagation());
});

if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}

if (projectModal) {
  projectModal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) closeProjectModal();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && projectModal && !projectModal.hasAttribute('hidden')) {
    closeProjectModal();
  }
});
