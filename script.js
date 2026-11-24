/**
 * ENTRE PRIVILEGIOS Y PROMESAS: ¿QUÉ OFRECE A IMBABURA?
 * Script interactivo ligero, limpio y accesible para el blog reportaje
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Barra de progreso de lectura (Scroll Progress Bar)
  // --------------------------------------------------------------------------
  const progressBar = document.getElementById('scrollProgressBar');
  
  function updateScrollProgress() {
    if (!progressBar) return;
    const docElement = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || docElement.scrollTop || body.scrollTop || 0;
    const scrollHeight = (docElement.scrollHeight || body.scrollHeight) - window.innerHeight;
    
    if (scrollHeight > 0) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // --------------------------------------------------------------------------
  // 2. Botón de Imprimir / Exportar a PDF
  // --------------------------------------------------------------------------
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // 4. Cerrar menú móvil al hacer clic en enlaces de navegación
  // --------------------------------------------------------------------------
  const siteMenu = document.getElementById('siteMenu') || document.getElementById('site-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (siteMenu && typeof siteMenu.hidePopover === 'function') {
        try {
          siteMenu.hidePopover();
        } catch (e) {
          // El popover ya estaba cerrado o es formato wide
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Scrollspy para la Tabla de Contenidos (resaltar sección activa)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('.reportage-section');
  const tocLinks = document.querySelectorAll('.toc-list a');

  if ('IntersectionObserver' in window && sections.length > 0 && tocLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.style.color = 'var(--color-primary)';
              link.style.fontWeight = '700';
              link.style.background = 'var(--color-primary-light)';
            } else {
              link.style.color = '';
              link.style.fontWeight = '';
              link.style.background = '';
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 6. Cálculo exacto y dinámico de palabras y tiempo de lectura
  // --------------------------------------------------------------------------
  const reportageBody = document.getElementById('reportageBody');
  const wordCountBadge = document.getElementById('wordCountBadge');
  const readingTimeBadge = document.getElementById('readingTimeBadge');

  if (reportageBody && (wordCountBadge || readingTimeBadge)) {
    const textContent = reportageBody.innerText || reportageBody.textContent || '';
    const words = textContent.trim().split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;

    // Velocidad promedio de lectura académica: ~200 palabras por minuto
    const wordsPerMinute = 200;
    const readingMinutes = Math.max(1, Math.ceil(totalWords / wordsPerMinute));

    if (wordCountBadge) {
      wordCountBadge.textContent = `${totalWords.toLocaleString('es-EC')} palabras`;
    }
    if (readingTimeBadge) {
      readingTimeBadge.textContent = `${readingMinutes} min de lectura`;
    }
  }

  // --------------------------------------------------------------------------
  // 7. Lightbox accesible con <dialog> para la galería de fotos
  // --------------------------------------------------------------------------
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const galleryCards = document.querySelectorAll('.gallery-item-card');

  if (lightbox && lightboxImg && lightboxCaption) {
    
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img-src');
        const captionText = card.getAttribute('data-caption') || '';
        
        lightboxImg.src = imgSrc;
        lightboxImg.alt = captionText;
        lightboxCaption.textContent = captionText;
        
        lightbox.showModal();
      });
    });

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', () => {
        lightbox.close();
      });
    }

    // Cerrar al hacer clic en el backdrop fuera del contenido
    lightbox.addEventListener('click', (event) => {
      const rect = lightbox.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      // Si se hace clic directamente en el backdrop del diálogo
      if (event.target === lightbox) {
        lightbox.close();
      }
    });

    // Cerrar con la tecla Escape está soportado nativamente por <dialog>, 
    // pero nos aseguramos de limpiar la imagen al cerrar
    lightbox.addEventListener('close', () => {
      lightboxImg.src = '';
    });
  }

});
