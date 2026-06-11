// =========================================================
// AmorsNadel – Main JavaScript
// Dark Luxury Liquid Glass Edition
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initGalleryFilters();
  initFormValidation();
  initScrollAnimations();
  initLightbox();
  initNavScroll();
  initGalleryFavorites();
  initParallax();
  initMagneticButtons();
  initScrollCue();
  initHeaderOnResize();
});

// =========================================================
// Mobile Navigation
// =========================================================
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// =========================================================
// Smooth Scroll for Anchor Links
// =========================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// =========================================================
// Gallery Filter Buttons (galerie.html)
// =========================================================
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
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          const tags = item.dataset.tags || '';
          if (tags.includes(filter)) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        }
      });
    });
  });
}

// =========================================================
// Form Validation
// =========================================================
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const required = form.querySelectorAll('[required]');

      // Reset styles
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.style.borderBottomColor = '';
      });

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
          submitBtn.textContent = '✓ ERFOLGREICH GESENDET';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.85';
          submitBtn.style.background = 'linear-gradient(135deg, #7BAA6E 0%, #5A8B4F 100%)';
          submitBtn.style.borderColor = '#7BAA6E';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            form.reset();
          }, 3500);
        }
      }
    });
  });
}

// =========================================================
// Scroll Reveal Animations (Luxury Edition)
// =========================================================
function initScrollAnimations() {
  // Skip if reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-scale, .reveal-fade').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Staggered delay for grouped elements
        const delay = parseInt(el.dataset.revealDelay || 0, 10);
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.reveal, .reveal-scale, .reveal-fade').forEach(el => observer.observe(el));
}

// =========================================================
// Lightbox (Galerie)
// =========================================================
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-fav')) return;
      const img = item.querySelector('img');
      const video = item.querySelector('video');
      if (img) {
        if (lightboxImg.tagName === 'VIDEO') {
          // Replace img with video element
          const newVid = document.createElement('video');
          newVid.src = img.src;
          newVid.className = 'lightbox__img';
          newVid.controls = true;
          newVid.autoplay = true;
          lightbox.replaceChild(newVid, lightboxImg);
        } else {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || '';
        }
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

// =========================================================
// Nav Scroll Effect
// =========================================================
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;
  function updateNav() {
    const y = window.scrollY;
    if (y > 50) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateNav();
}

// =========================================================
// Gallery Favorites (LocalStorage)
// =========================================================
function initGalleryFavorites() {
  const favButtons = document.querySelectorAll('.gallery-fav');
  if (!favButtons.length) return;

  const stored = JSON.parse(localStorage.getItem('amorsnadel-favs') || '[]');

  // Restore
  favButtons.forEach(btn => {
    const id = btn.dataset.id;
    if (stored.includes(id)) {
      btn.classList.add('is-active');
      btn.textContent = '♥';
    } else {
      btn.classList.remove('is-active');
      btn.textContent = '♡';
    }
  });

  // Toggle with heart pop animation
  favButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const idx = stored.indexOf(id);

      // Pop animation
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 250);

      if (idx === -1) {
        stored.push(id);
        btn.classList.add('is-active');
        btn.textContent = '♥';
      } else {
        stored.splice(idx, 1);
        btn.classList.remove('is-active');
        btn.textContent = '♡';
      }
      localStorage.setItem('amorsnadel-favs', JSON.stringify(stored));
    });
  });
}

// =========================================================
// Parallax Hero Background (subtle, GPU friendly)
// =========================================================
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroBg = document.querySelector('.hero__bg img');
  if (!heroBg) return;

  let ticking = false;
  function update() {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y * 0.0002})`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

// =========================================================
// Magnetic Buttons (Luxury micro-interaction)
// =========================================================
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return; // Skip on touch

  const buttons = document.querySelectorAll('.btn, .nav__cta, .floating-bar__btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// =========================================================
// Scroll Cue (Hero indicator) – hide when scrolled
// =========================================================
function initScrollCue() {
  const cue = document.querySelector('.hero__scroll-cue');
  if (!cue) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      cue.style.opacity = '0';
      cue.style.pointerEvents = 'none';
    } else {
      cue.style.opacity = '';
      cue.style.pointerEvents = '';
    }
  }, { passive: true });
}

// =========================================================
// Resize Listener (debounced)
// =========================================================
function initHeaderOnResize() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nav = document.querySelector('.nav');
      if (window.innerWidth >= 768) {
        const mobileMenu = document.querySelector('.nav__mobile-menu');
        const hamburger = document.querySelector('.nav__hamburger');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    }, 150);
  });
}
