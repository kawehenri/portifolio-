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
  'Da ideia ao app na loja',
  'Web, mobile e integrações',
  'Projetos autorais no GitHub',
  'Aprendendo em produção na DF Informática',
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
    urlLive: 'https://aquafloww.site/',
    urlCode: 'https://github.com/kawehenri/kawehenri.github.io.git',
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
  edo: {
    category: 'Web · UX',
    title: 'Edo Bistro',
    subtitle: 'Site e conceito de produto para culinária japonesa.',
    impact: 'Validação de UX antes de escalar — wireframes e testes de interface.',
    context: 'Projeto autoral.',
    stack: 'Stack: HTML · CSS · JavaScript · UX',
    body: `<p>Site e exploração de <strong>marketplace de reviews verticais</strong> para culinária japonesa — do sashimi ao <strong>omakase</strong>. Hipóteses de UX, taxonomia de pratos e critérios culturais; protótipo publicado com fluxo navegável para validar proposta antes de escalar.</p>`,
    urlLive: 'http://aquafloww.site/Edo_Bistr-/',
    urlCode: 'https://github.com/kawehenri/Edo_Bistr-.git',
  },
  mesas: {
    category: 'Web App · Demo',
    title: 'Tarsila — reserva de mesas',
    subtitle: 'Fluxo de reserva, lista de espera e vitrine de restaurante.',
    impact: 'Demonstração interativa: data, horário e número de pessoas no browser.',
    context: 'Projeto autoral — demo de experiência gastronômica.',
    stack: 'Stack: React · TypeScript · Vite',
    body: `<p>Demonstração de <strong>restaurante fictício</strong> (Tarsila Cozinha Brasil) com cardápio, avaliações, unidades e fluxo completo de <strong>reserva de mesa</strong> e <strong>lista de espera</strong> — tudo no navegador, sem backend em produção. Foco em UX de agendamento e narrativa visual de marca.</p>`,
    urlLive: 'http://aquafloww.site/sistema_gest-o_mesa/',
    urlCode: 'https://github.com/kawehenri/sistema_gest-o_mesa.git',
  },
  elloa: {
    category: 'Web · Media kit',
    title: 'Elloa — portfólio de atleta',
    subtitle: 'Site de apresentação para atleta de judô.',
    impact: 'Media kit completo: sobre, números, parcerias, galeria e contato.',
    context: 'Projeto autoral.',
    stack: 'Stack: React · TypeScript · Vite · Tailwind CSS',
    body: `<p>Página única em <strong>React + Vite + Tailwind</strong> para apresentar um atleta de judô a patrocinadores e público: seções de biografia, conquistas, parcerias, galeria de mídia e contato. Conteúdo centralizado em arquivo de configuração para facilitar atualizações sem reescrever componentes.</p>`,
    urlLive: 'https://elloapessoa.site',
    urlCode: 'https://github.com/kawehenri/elloa.git',
  },
  autentica: {
    category: 'DF Informática · E-commerce',
    title: 'Autentica Moda Femina',
    subtitle: 'Loja online de moda feminina.',
    impact: 'Vitrine e checkout em produção para cliente real.',
    context: 'Estágio na DF Informática — entrega para cliente.',
    stack: 'Stack: Web · E-commerce · Integrações',
    body: `<p><strong>E-commerce de moda feminina</strong> desenvolvido no contexto do estágio na DF Informática: catálogo, experiência de compra e operação voltada ao varejo de vestuário. Sistema em uso pelo cliente em produção.</p>`,
    urlLive: 'https://autenticabysilvia.com.br',
    urlCode: '',
  },
  calheiro: {
    category: 'DF Informática · Mobile',
    title: 'Calheiro Orça Fácil',
    subtitle: 'Orçamentos para calheiros no celular.',
    impact: 'Fluxo mobile-first para orçar serviços em campo.',
    context: 'Estágio na DF Informática — entrega para cliente.',
    stack: 'Stack: Web App · Mobile · PWA',
    body: `<p>Aplicação <strong>mobile-first</strong> para calheiros montarem e enviarem orçamentos direto do celular, reduzindo papelada e acelerando o retorno ao cliente. Em produção na DF Informática.</p>`,
    urlLive: 'https://app.calheiroorcafacil.com.br',
    urlCode: '',
  },
  ino9: {
    category: 'DF Informática · Sistema web',
    title: 'Ino9Sports',
    subtitle: 'Personalização de materiais esportivos.',
    impact: 'Gestão de pedidos e customização para loja esportiva.',
    context: 'Estágio na DF Informática — entrega para cliente.',
    stack: 'Stack: Web · Gestão · Laravel/React (conforme stack interna)',
    body: `<p>Sistema para loja de <strong>personalização de materiais esportivos</strong>: fluxo de pedidos, customização de produtos e operação do negócio em ambiente web. Solução mantida em produção pela equipe da DF Informática.</p>`,
    urlLive: 'https://sistema.ino9sports.com',
    urlCode: '',
  },
  tendtudo: {
    category: 'DF Informática · Gestão',
    title: 'TendTudo',
    subtitle: 'Gestão de frota e operação logística.',
    impact: 'Controle centralizado de veículos e rotinas da frota.',
    context: 'Estágio na DF Informática — entrega para cliente.',
    stack: 'Stack: Web · Gestão de frota',
    body: `<p><strong>Sistema de gestão de frota</strong> para acompanhar veículos, operações e rotinas logísticas do cliente. Ferramenta web em produção, usada no dia a dia da operação.</p>`,
    urlLive: 'https://tendtudojaru.com.br',
    urlCode: '',
  },
  ecolimp: {
    category: 'DF Informática · Gestão',
    title: 'Ecolimp',
    subtitle: 'Gestão empresarial com foco em rotas.',
    impact: 'Planejamento de rotas integrado à operação do negócio.',
    context: 'Estágio na DF Informática — entrega para cliente.',
    stack: 'Stack: Web · Gestão · Mapas/rotas',
    body: `<p>Sistema de <strong>gestão empresarial</strong> com ênfase em <strong>planejamento de rotas</strong> e organização operacional. Desenvolvido no estágio na DF Informática e utilizado pelo cliente em ambiente de produção.</p>`,
    urlLive: 'https://sistema.ecolimpdf.com/',
    urlCode: '',
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

  if (d.urlCode) {
    projectModalCode.href = d.urlCode;
    projectModalCode.hidden = false;
  } else {
    projectModalCode.hidden = true;
  }

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
  if (e.key === 'Escape' && curriculoModal && !curriculoModal.hasAttribute('hidden')) {
    closeCurriculoModal();
  }
});


/* ──────────────────────────────────────────────
   10. MODAL CURRÍCULO — PT-BR ou EN (PDF)
────────────────────────────────────────────── */
const btnVerCurriculo    = document.getElementById('btnVerCurriculo');
const curriculoModal     = document.getElementById('curriculoModal');
const curriculoModalClose = document.getElementById('curriculoModalClose');
let curriculoModalLastFocus = null;

function openCurriculoModal() {
  if (!curriculoModal) return;
  curriculoModalLastFocus = document.activeElement;
  curriculoModal.removeAttribute('hidden');
  curriculoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  curriculoModalClose.focus();
}

function closeCurriculoModal() {
  if (!curriculoModal || curriculoModal.hasAttribute('hidden')) return;
  curriculoModal.setAttribute('hidden', '');
  curriculoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (curriculoModalLastFocus && typeof curriculoModalLastFocus.focus === 'function') {
    curriculoModalLastFocus.focus();
  }
  curriculoModalLastFocus = null;
}

if (btnVerCurriculo) {
  btnVerCurriculo.addEventListener('click', openCurriculoModal);
}

if (curriculoModalClose) {
  curriculoModalClose.addEventListener('click', closeCurriculoModal);
}

if (curriculoModal) {
  curriculoModal.addEventListener('click', e => {
    if (e.target.closest('[data-close-curriculo]')) closeCurriculoModal();
  });
}
