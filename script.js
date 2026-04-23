/* ===== ISAAC NEWTON — Premium Landing Page JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header Scroll Effect ---------- */
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  /* ---------- Scroll Reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        // Ease-out quad
        const progress = step / steps;
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        current = Math.round(easedProgress * target);

        if (step >= steps) {
          current = target;
          clearInterval(timer);
        }

        counter.textContent = current.toLocaleString('es-EC');
      }, duration / steps);
    });
  }

  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);

  /* ---------- Gold Particle Canvas ---------- */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
      // Gold-ish hues
      const hue = 38 + Math.random() * 20;
      const sat = 70 + Math.random() * 30;
      const light = 55 + Math.random() * 20;
      this.color = `hsla(${hue}, ${sat}%, ${light}%,`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDir * 0.003;

      if (this.opacity <= 0.05 || this.opacity >= 0.6) {
        this.fadeDir *= -1;
      }

      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();

      // Glow
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
        ctx.fill();
      }
    }
  }

  const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
  const particles = Array.from({ length: particleCount }, () => new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ---------- Bento Card Gravity Hover Effect ---------- */
  const bentoCards = document.querySelectorAll('.bento-card');

  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Pricing Card Tilt ---------- */
  const priceCards = document.querySelectorAll('.price-card');

  priceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      const baseScale = card.classList.contains('featured') ? 1.03 : 1;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(${baseScale})`;
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('featured')) {
        card.style.transform = 'scale(1.03)';
      } else {
        card.style.transform = '';
      }
    });
  });

  /* ---------- Button Orbital Pulse Effect ---------- */
  const buttons = document.querySelectorAll('.btn-primary, .btn-cta-big');

  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.animation = 'none';
      void btn.offsetHeight; // reflow
      btn.style.animation = 'btn-energy 0.6s ease-out';
    });

    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    });
  });

  // Inject keyframe for button energy
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes btn-energy {
      0% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.5); }
      50% { box-shadow: 0 0 0 12px rgba(201, 168, 76, 0); }
      100% { box-shadow: 0 12px 40px rgba(201, 168, 76, 0.4); }
    }
  `;
  document.head.appendChild(styleSheet);

  /* ---------- Smooth scroll for internal links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Modal Interactivity (Clickable Bento Cards) ---------- */
  const clickableCards = document.querySelectorAll('.bento-card--clickable[data-modal]');
  const modalOverlay = document.getElementById('modal-pasos');
  const modalCloseBtn = document.getElementById('modal-close');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Re-trigger step animations by removing and re-adding class
    const steps = modal.querySelectorAll('.step-item');
    steps.forEach(step => {
      step.style.animation = 'none';
      step.offsetHeight; // reflow
      step.style.animation = '';
    });
  }

  function closeModal() {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (!activeModal) return;
    activeModal.classList.remove('active');
    activeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open modal from clickable bento cards
  clickableCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      openModal(modalId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalId = card.getAttribute('data-modal');
        openModal(modalId);
      }
    });
  });

  // Close modal with X button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Close modal by clicking backdrop
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

});
