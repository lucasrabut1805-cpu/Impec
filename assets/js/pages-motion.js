/* IMPEC — Autres pages : réutilise le système de révélation de main.js.
   À charger après main.js, avant </body>. Aucune bibliothèque à ajouter. */
(() => {
    const page = document.body?.dataset.page;
    if (!['studio', 'projets', 'services', 'contact'].includes(page)) return;
    if (document.body.classList.contains('impec-pages-motion')) return;
    if (!('IntersectionObserver' in window)) return;

    const style = document.createElement('style');
    style.textContent = `
        body.impec-pages-motion .reveal-on-scroll {
            transition-duration: 1.1s;
            transition-timing-function: cubic-bezier(.22, 1, .36, 1);
        }
        body.impec-pages-motion .reveal-left { transform: translateX(-24px); }
        body.impec-pages-motion .reveal-right { transform: translateX(24px); }
        body.impec-pages-motion .reveal-top { transform: translateY(-24px); }
        body.impec-pages-motion .reveal-bottom { transform: translateY(24px); }
        body.impec-pages-motion .reveal-on-scroll.is-visible,
        body.impec-pages-motion .reveal-on-scroll:focus-within {
            opacity: 1; transform: none;
        }
        body.impec-pages-motion [data-impec-fade] { transform: none; }
        @media (max-width: 768px) {
            body.impec-pages-motion .reveal-on-scroll { transition-duration: .9s; }
            body.impec-pages-motion .reveal-left,
            body.impec-pages-motion .reveal-right,
            body.impec-pages-motion .reveal-bottom { transform: translateY(14px); }
            body.impec-pages-motion .reveal-on-scroll.is-visible,
            body.impec-pages-motion .reveal-on-scroll:focus-within,
            body.impec-pages-motion [data-impec-fade] { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
            body.impec-pages-motion .reveal-on-scroll {
                opacity: 1 !important; transform: none !important;
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.classList.add('impec-pages-motion');

    function add(selector, direction = 'bottom', step = 0) {
        document.querySelectorAll(selector).forEach((el, index) => {
            // Évite d'animer à la fois un bloc existant et son contenu.
            if (el.closest('.reveal-on-scroll, [data-aos]')) return;
            el.classList.add('reveal-on-scroll', `reveal-${direction}`);
            el.dataset.revealDelay = String((index % 2) * step);
            if (direction === 'fade') el.dataset.impecFade = 'true';
        });
    }

    add('.page-hero .titre-img-projets');
    if (page === 'studio') {
        add('.studio-hero-description');
        add('.about-showcase-left-title', 'left');
        add('.about-vision-box > p', 'bottom', 120);
        add('.about-method-title', 'right');
        add('.about-showcase-right > p');
    }
    if (page === 'services') {
        add('.service-row-media');
        add('.service-row-text > h2, .service-row-text > h3', 'left');
        add('.service-row-text > p', 'bottom', 100);
        add('.service-inline-buttons', 'fade');
        add('.cta-box-text > h2, .cta-box-text > p', 'bottom', 100);
        add('.cta-box-text > .btn', 'fade');
        add('.cta-box-visual', 'right');
    }
    if (page === 'projets' && !document.body.dataset.projectCurrent) {
        add('.projects-page .projects-grid-page > .project-card-page', 'bottom', 140);
    }
    if (page === 'contact') {
        add('.contact-showcase-left > h1, .contact-showcase-left > h2, .contact-intro');
        add('.contact-cards > .contact-link-card', 'bottom', 100);
        // Le formulaire reste immobile, et visible dès qu'un champ reçoit le focus.
        add('.contact-form-showcase', 'fade');
    }
    // Les projets détaillés conservent leurs révélations déjà présentes,
    // leur bannière horizontale et leur galerie défilante.
    // main.js observe les nouvelles classes au DOMContentLoaded.
    if (document.readyState !== 'loading' && typeof window.initRevealAnimations === 'function') {
        window.initRevealAnimations();
    }
})();
