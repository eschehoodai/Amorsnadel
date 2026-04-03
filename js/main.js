// ===== AmorsNadel – Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initGalleryFilters();
  initFormValidation();
  initScrollAnimations();
});

// ===== Mobile Navigation =====
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== Gallery Filter Buttons =====
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-bar__btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('filter-bar__btn--active'));
      btn.classList.add('filter-bar__btn--active');

      const filter = btn.dataset.filter;
      const items = document.querySelectorAll('.gallery-item');

      items.forEach(item => {
        if (!filter || filter === 'all') {
          item.style.display = '';
        } else {
          const tags = item.dataset.tags || '';
          item.style.display = tags.includes(filter) ? '' : 'none';
        }
      });
    });
  });
}

// ===== Basic Form Validation =====
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const required = form.querySelectorAll('[required]');

      required.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderBottomColor = 'var(--error)';

          field.addEventListener('input', function handler() {
            if (field.value.trim()) {
              field.style.borderBottomColor = '';
              field.removeEventListener('input', handler);
            }
          });
        }
      });

      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          isValid = false;
          emailField.style.borderBottomColor = 'var(--error)';
        }
      }

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'GESENDET ✓';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            form.reset();
          }, 3000);
        }
      }
    });
  });
}

// ===== Scroll Reveal Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
