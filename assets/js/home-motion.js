/* IMPEC — Accueil, version 3 : scènes coordonnées et rejouables.
   Charger ce fichier UNE fois, après GSAP et ScrollTrigger, en fin de body. */
(() => {
    if (document.body?.dataset.page !== 'accueil') return;
    if (document.body.dataset.homeMotionBound) return;
    if (!window.gsap || !window.ScrollTrigger) return;
    document.body.dataset.homeMotionBound = 'v3';
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    // Un seul moteur possède la présentation et le contact sur cette page.
    $$('.intro-home [data-aos], .cta-section [data-aos]').forEach(el => {
        [...el.attributes].forEach(attr => {
            if (attr.name.startsWith('data-aos')) el.removeAttribute(attr.name);
        });
        el.classList.remove('aos-init', 'aos-animate');
    });

    const media = gsap.matchMedia();
    media.add({
        reduced: '(prefers-reduced-motion: reduce)',
        mobile: '(max-width: 768px)',
        desktop: '(min-width: 769px)',
        tablet: '(min-width: 601px) and (max-width: 780px)',
        phone: '(max-width: 600px)'
    }, context => {
        if (context.conditions.reduced) return;
        const mobile = context.conditions.mobile;
        const splits = []; const scenes = [];
        const distance = mobile ? 18 : 38;
        const duration = mobile ? 0.95 : 1.2;

        function scene(anchor, build) {
            if (!anchor) return;
            const timeline = gsap.timeline({ paused: true });
            const enter = () => timeline.restart();
            const finish = () => timeline.progress(1).pause(); scenes.push({ anchor, finish });
            // Mesure avant les translations : le point de départ reste stable.
            const trigger = ScrollTrigger.create({
                trigger: anchor,
                start: mobile ? 'top 88%' : 'top 82%',
                end: 'bottom top',
                onEnter: enter,
                onEnterBack: enter,
                onLeave: finish,
                onLeaveBack: finish
            });
            // Uniquement hors écran : prépare la prochaine descente sans clignoter.
            ScrollTrigger.create({
                trigger: anchor, start: 'top bottom', end: 'bottom top',
                onLeaveBack: () => timeline.pause(0)
            });
            build(timeline);
            if (trigger.scroll() >= trigger.start) {
                // Une page rechargée à mi-parcours garde ses contenus accessibles.
                if (window.scrollY < 8) timeline.play(0); else finish();
            } else {
                timeline.pause(0);
            }
        }

        function reveal(tl, target, at = 0, kind = 'up', options = {}) {
            const elements = Array.isArray(target) ? target.filter(Boolean) : target;
            if (!elements || (Array.isArray(elements) && !elements.length)) return;
            const { stagger = 0, time = duration, direction = -1 } = options;
            const from = { opacity: 0 };
            const to = { opacity: 1 };
            if (kind === 'side') {
                from.x = direction * (mobile ? 10 : 26); to.x = 0;
            } else if (kind === 'image') {
                from.scale = 1.035; from.y = mobile ? 10 : 20;
                to.scale = 1; to.y = 0;
            } else if (kind !== 'button') {
                from.y = distance; to.y = 0;
            }
            tl.fromTo(elements, from, {
                ...to, duration: time, stagger,
                ease: 'power2.out', immediateRender: true,
                clearProps: kind === 'button' ? 'opacity' : 'opacity,transform'
            }, at);
        }

        // Seules les courtes phrases sous les titres sont divisées en mots.
        function phrase(el) {
            if (!el) return;
            scene(el, tl => {
                if (window.SplitText) {
                    gsap.registerPlugin(window.SplitText);
                    const split = window.SplitText.create(el, { type: 'words', aria: 'auto' });
                    splits.push(split);
                    reveal(tl, split.words, 0, 'side', {
                        stagger: index => Math.floor(index / 3) * 0.12, time: 0.95
                    });
                } else {
                    reveal(tl, el, 0, 'side');
                }
            });
        }

        // Les titres PNG restent des images ; aucune découpe de lettres.
        $$('.intro-home .titre-img-1, .services-home .titre-img, .packs-home .titre-img, .projects-home .titre-img').forEach(el => {
            scene(el, tl => reveal(tl, el, 0, 'up', { time: mobile ? 1 : 1.35 }));
        });
        $$('.services-heading .section-label, .packs-home__subtitle').forEach(phrase);

        // Le hero conserve SplitText ; les boutons apparaissent l'un après l'autre.
        scene($('.hero-actions'), tl => {
            reveal(tl, $$('.hero-actions > .btn'), 0, 'button', { stagger: 0.18 });
        });

        const intro = $('.intro-studio-card');
        scene(intro, tl => {
            reveal(tl, $('.intro-studio-visual img', intro), 0, 'image');
            reveal(tl, $$('.intro-studio-text > p', intro), 0.18, 'side', { stagger: 0.18 });
            reveal(tl, $('.intro-studio-text > .btn', intro), 0.55, 'button');
        });

        // Chaque partie a son propre seuil : le paragraphe attend d'être visible.
        $$('.service-home-card').forEach((card, index) => {
            const media = $('.service-home-card-media', card);
            const title = $('.service-home-card-top', card);
            const paragraph = $('.service-home-card-content > p', card);
            const buttons = $('.service-card-buttons', card);
            const offset = mobile ? 0 : index * 0.16;
            scene(media, tl => reveal(tl, media, offset, 'image'));
            scene(title, tl => reveal(tl, title, offset, 'side', { direction: index % 2 ? 1 : -1 }));
            scene(paragraph, tl => reveal(tl, paragraph, offset, 'up'));
            scene(buttons, tl => reveal(tl, $$('.btn', buttons), 0, 'button', { stagger: 0.16, time: 0.95 }));
        });

        // Cartes du bas, textes du côté, puis visuel : une scène par rangée.
        const packs = $$('.packs-home__card');
        function packSequence(tl, card, offset) {
            reveal(tl, card, offset, 'up');
            reveal(tl, $('.packs-home__card-heading h3', card), offset + 0.25, 'side');
            reveal(tl, $('.packs-home__price', card), offset + 0.12, 'button', { time: 0.9 });
            reveal(tl, $$('.packs-home__features > li', card), offset + 0.32, 'side', {
                stagger: 0.09, time: 0.85
            });
            reveal(tl, $('.packs-home__summary', card), offset + 0.65, 'side', { time: 0.9 });
            reveal(tl, $('.packs-home__visual', card), offset + 0.55, 'image');
        }
        // Respecte automatiquement les rangées réelles (4 / 2 / 1 colonnes).
        const rows = [];
        packs.forEach(card => {
            let row = rows.find(row => Math.abs(row.top - card.offsetTop) < 4);
            if (!row) { row = { top: card.offsetTop, cards: [] }; rows.push(row); }
            row.cards.push(card);
        });
        rows.forEach(row => scene(row.cards[0], tl => {
            row.cards.forEach((card, index) => packSequence(tl, card, index * 0.18));
        }));

        const showcase = $('.projects-home .projects-showcase');
        // On garde les transformations et les interactions des cartes 3D intactes.
        scene(showcase, tl => reveal(tl, showcase));
        $$('.center-button-1, .projects-home .center-button').forEach(el => {
            scene(el, tl => reveal(tl, $('.btn', el), 0, 'button'));
        });

        const contact = $('.cta-box');
        scene(contact, tl => {
            reveal(tl, $('.cta-box-visual img', contact), 0, 'image');
            reveal(tl, $$('.cta-box-text > p, .cta-box-text > h2', contact), 0.15, 'side', { stagger: 0.18 });
            reveal(tl, $('.cta-box-text > .btn', contact), 0.65, 'button');
        });

        // Sécurité clavier : un élément recevant le focus devient visible aussitôt.
        const onFocus = event => {
            scenes.forEach(({ anchor, finish }) => {
                if (anchor.contains(event.target)) finish();
            });
        };
        document.addEventListener('focusin', onFocus);
        return () => {
            document.removeEventListener('focusin', onFocus);
            splits.forEach(split => split.revert());
        };
    });
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    document.addEventListener('includes:loaded', () => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();

