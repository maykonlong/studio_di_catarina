/* ==========================================================================
   STUDIO DI CATARINA - WEBAPP EXPERIENCE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const navLinks = document.querySelectorAll('.nav-link');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

  // --- CREATE BACKDROP OVERLAY FOR MOBILE MENU ---
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  // --- SERVICE WORKER REGISTRATION (PWA WEBAPP) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado:', reg.scope);
        })
        .catch((err) => {
          console.log('[PWA] Erro ao registrar Service Worker:', err);
        });
    });
  }

  // --- PWA INSTALL BANNER PROMPT ---
  let deferredPrompt;
  const pwaBanner = document.getElementById('pwaInstallBanner');
  const pwaBtn = document.getElementById('pwaInstallBtn');
  const pwaClose = document.getElementById('pwaInstallClose');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner) {
      pwaBanner.classList.add('active');
    }
  });

  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Escolha do usuário: ${outcome}`);
        deferredPrompt = null;
        if (pwaBanner) pwaBanner.classList.remove('active');
      } else {
        alert('Para instalar no iOS: toque no botão Compartilhar do Safari e selecione "Adicionar à Tela Início".');
      }
    });
  }

  if (pwaClose) {
    pwaClose.addEventListener('click', () => {
      if (pwaBanner) pwaBanner.classList.remove('active');
    });
  }

  // --- NATIVE BOTTOM SHEET BOOKING MODAL ---
  const bottomSheetBackdrop = document.getElementById('bottomSheetBackdrop');
  const bottomSheet = document.getElementById('bottomSheet');
  const closeBottomSheetBtn = document.getElementById('closeBottomSheet');
  const serviceOptionCards = document.querySelectorAll('.service-select-card');
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');
  let selectedService = 'Mechas e Cabelo';

  const openBottomSheet = (serviceName = 'Cabelo, Unha ou Sobrancelha') => {
    selectedService = serviceName;
    if (bottomSheetBackdrop && bottomSheet) {
      bottomSheetBackdrop.classList.add('active');
      bottomSheet.classList.add('active');
    }
  };

  const closeBottomSheet = () => {
    if (bottomSheetBackdrop && bottomSheet) {
      bottomSheetBackdrop.classList.remove('active');
      bottomSheet.classList.remove('active');
    }
  };

  if (closeBottomSheetBtn) {
    closeBottomSheetBtn.addEventListener('click', closeBottomSheet);
  }

  if (bottomSheetBackdrop) {
    bottomSheetBackdrop.addEventListener('click', closeBottomSheet);
  }

  // Handle service selection inside bottom sheet
  serviceOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceOptionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedService = card.getAttribute('data-service-name') || 'Procedimento';
    });
  });

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const msg = encodeURIComponent(`Olá! Vim pelo WebApp do Studio Di Catarina e gostaria de agendar: ${selectedService}.`);
      window.open(`https://wa.me/5511910618237?text=${msg}`, '_blank');
      closeBottomSheet();
    });
  }

  // Connect WhatsApp bottom nav tab to open bottom sheet or direct whatsapp
  const bottomWhatsappTab = document.querySelector('.bottom-nav-item.whatsapp-tab');
  if (bottomWhatsappTab && window.innerWidth <= 768) {
    bottomWhatsappTab.addEventListener('click', (e) => {
      e.preventDefault();
      openBottomSheet('Procedimento Desejado');
    });
  }

  // --- MOBILE MENU TOGGLE WITH BACKDROP ---
  const closeMobileMenu = () => {
    if (navMenu) navMenu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'ri-menu-line';
    }
  };

  const openMobileMenu = () => {
    if (navMenu) navMenu.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'ri-close-line';
    }
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMobileMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // --- HEADER SCROLL EFFECT ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
        header.style.background = 'rgba(18, 16, 16, 0.96)';
      }
    } else {
      if (header) {
        header.style.boxShadow = 'none';
        header.style.background = 'var(--glass-bg)';
      }
    }
  });

  // --- SERVICES FILTERING SYSTEM ---
  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        serviceCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --- ACTIVE NAV LINK & BOTTOM NAV ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        bottomNavItems.forEach(item => {
          if (!item.classList.contains('whatsapp-tab')) {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
              item.classList.add('active');
            }
          }
        });
      }
    });
  });

  // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.rebrand-card, .service-card, .testimonial-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
