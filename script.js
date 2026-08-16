/* =========================================================
   NEUROCLÍNICA — script.js
   Menu mobile · FAQ (acordeão) · Contadores animados
   Reveal ao rolar a página · Formulário de contato
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu hambúrguer (mobile) ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu ao clicar em um link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Acordeão (Psicologia na prática) ---------- */
  var triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = trigger.nextElementSibling;
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha os outros itens abertos (comportamento tipo "sanfona")
      triggers.forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Contadores animados (Sobre) ---------- */
  var counters = document.querySelectorAll('.stat-number');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10) || 0;
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Reveal ao rolar + gatilho dos contadores ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var statsSection = document.querySelector('.stats');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (entry.target === statsSection) animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback sem IntersectionObserver
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    animateCounters();
  }

  /* ---------- Mensagem padrão nos links diretos de WhatsApp ---------- */
  // Aplica um texto inicial nos botões que abrem o WhatsApp direto (fora do formulário),
  // para a pessoa não precisar digitar do zero ao chegar na conversa.
  var WA_DEFAULT_MESSAGE = 'Olá! Encontrei o site da Neuroclínica e gostaria de agendar uma conversa.';
  document.querySelectorAll('.whatsapp-link').forEach(function (link) {
    try {
      var url = new URL(link.href);
      if (!url.searchParams.has('text')) {
        url.searchParams.set('text', WA_DEFAULT_MESSAGE);
        link.href = url.toString();
      }
    } catch (err) {
      // Se o href não for uma URL válida, apenas ignora.
    }
  });

  /* ---------- Formulário de contato → WhatsApp ---------- */
  // Número oficial da Neuroclínica no WhatsApp (com código do país e DDD).
  var WHATSAPP_NUMBER = '5531993736336';

  var form = document.getElementById('contact-form');
  var successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nome = form.nome.value.trim();
      var whatsapp = form.whatsapp.value.trim();
      var email = form.email.value.trim();
      var assunto = form.assunto.value;
      var mensagem = form.mensagem.value.trim();

      // Monta a mensagem que será enviada para o WhatsApp da clínica.
      var texto =
        'Olá, Neuroclínica! Vim pelo site e gostaria de agendar uma conversa.\n\n' +
        'Nome: ' + nome + '\n' +
        'WhatsApp para contato: ' + whatsapp + '\n' +
        'E-mail: ' + email + '\n' +
        'Assunto: ' + assunto +
        (mensagem ? '\nMensagem: ' + mensagem : '');

      var link = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);

      // Como o site é estático (sem servidor), o envio acontece abrindo o
      // WhatsApp do usuário já com a mensagem pronta para ser enviada à clínica.
      window.open(link, '_blank', 'noopener');

      form.reset();
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---------- Header: sombra sutil ao rolar ---------- */
  var header = document.querySelector('.site-header');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var current = window.scrollY;
    if (header) {
      header.style.boxShadow = current > 12 ? '0 8px 24px -18px rgba(30,43,41,.4)' : 'none';
    }
    lastScroll = current;
  }, { passive: true });

});
