/* script.js
   - Form submission to Formspree via AJAX (fetch)
   - Scroll reveal using IntersectionObserver
   - Nav active highlight
   - Modal control for thank-you
*/

/* ========== CONFIG ========== */
/* Replace this with your Formspree endpoint AFTER creating it.
   Example Formspree endpoint: https://formspree.io/f/mabcdxyz
*/
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID_HERE";

/* ========== DOM ========== */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const modal = document.getElementById('thankyouModal');
const modalClose = document.getElementById('modalClose');
const yearSpan = document.getElementById('year');

/* set year */
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ========== FORM SUBMIT (AJAX to Formspree) ========== */
if (form) {
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    formStatus.textContent = "Sending…";
    const data = new FormData(form);

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (resp.ok) {
        formStatus.textContent = "";
        form.reset();
        showModal();
      } else {
        const result = await resp.json();
        formStatus.textContent = result.error || 'Failed to send. Try again later.';
      }
    } catch (err) {
      formStatus.textContent = 'Network error — try again later.';
    }
  });
}

/* ========== MODAL ========== */
function showModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
}
function hideModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
}
if (modalClose) modalClose.addEventListener('click', hideModal);

/* close modal on background click */
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });
}

/* ========== SCROLL REVEAL ========== */
const reveals = document.querySelectorAll('.reveal, .hero .hero-content, .hero-card, .work-card, .service-card, .contact-form');

const obsOptions = {
  threshold: 0.12
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, obsOptions);

revealObserver.observe(document.querySelector('.hero')); // hero shown immediately
reveals.forEach(el => revealObserver.observe(el));

/* ========== NAV ACTIVE HIGHLIGHT ========== */
const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => {
  if (s) navObserver.observe(s);
});
