/* =========================================================
   HEADER + MENU
========================================================= */
function initHeader() {
    if (!document.body.dataset.headerScrollBound) {
        document.body.dataset.headerScrollBound = "true";

        const updateTopState = () => {
            document.body.classList.toggle("is-at-top", window.scrollY <= 10);
        };

        updateTopState();
        window.addEventListener("scroll", updateTopState, { passive: true });
    }

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (toggle && nav && !toggle.dataset.bound) {
        toggle.dataset.bound = "true";

        toggle.addEventListener("click", () => {
            const opened = nav.classList.toggle("is-open");
            toggle.classList.toggle("is-open", opened);
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }
}

/* =========================================================
   MENU ACTIF
========================================================= */
function initActiveMenu() {
    const currentPage = document.body.dataset.page;
    if (!currentPage) return;

    document.querySelectorAll(".nav-list a").forEach((link) => {
        if (link.dataset.link === currentPage) {
            link.classList.add("active");
        }
    });
}

/* =========================================================
   REVEAL ON SCROLL
========================================================= */
function initRevealAnimations() {
    const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll"));

    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const el = entry.target;
            const delay = el.dataset.revealDelay || "0";

            if (entry.isIntersecting) {
                el.style.transitionDelay = `${delay}ms`;
                el.classList.add("is-visible");
            } else {
                el.classList.remove("is-visible");
                el.style.transitionDelay = "0ms";
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item) => {
        if (!item.dataset.revealBound) {
            item.dataset.revealBound = "true";
            revealObserver.observe(item);
        }
    });
}

/* =========================================================
   AOS
========================================================= */
function initAOS() {
    if (!window.AOS) return;

    AOS.init({
        once: false,
        mirror: true,
        duration: 900,
        offset: 120,
        easing: "ease-out-cubic",
        anchorPlacement: "top-bottom"
    });

    setTimeout(() => {
        AOS.refreshHard();
    }, 100);
}

/* =========================================================
   GSAP SPLIT TEXT
========================================================= */
function initSplitText() {
    if (
        typeof gsap === "undefined" ||
        typeof SplitText === "undefined"
    ) return;

    gsap.registerPlugin(SplitText);

    document.querySelectorAll(".js-split-words").forEach((element, index) => {
        if (element.dataset.splitBound) return;
        element.dataset.splitBound = "true";

        const split = SplitText.create(element, {
            type: "words"
        });

        gsap.from(split.words, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.06,
            delay: 0.15 + index * 0.12
        });
    });
}

/* =========================================================
   SCROLL HORIZONTAL PROJETS
========================================================= */
function initProjectBannerScroll() {
    const sections = document.querySelectorAll("[data-project-banner]");

    sections.forEach((section) => {
        const track = section.querySelector("[data-project-banner-track]");
        const slide = section.querySelector(".project-banner-slide");
        const progressBar = section.querySelector(".project-progress-bar");

        if (!track || !slide || !progressBar) return;

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

        const updateHorizontalScroll = () => {
            const viewportWidth = window.innerWidth;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const viewportH = window.innerHeight;

            const maxScroll = Math.max(sectionHeight - viewportH, 1);
            const current = clamp(window.scrollY - sectionTop, 0, maxScroll);
            const progress = current / maxScroll;

            const maxTranslate = Math.max(track.scrollWidth - viewportWidth, 0);

            track.style.transform = `translateX(-${progress * maxTranslate}px)`;
            progressBar.style.width = `${progress * 100}%`;
        };

        updateHorizontalScroll();

        window.addEventListener("scroll", updateHorizontalScroll, { passive: true });
        window.addEventListener("resize", updateHorizontalScroll);
    });
}

/* =========================================================
   PROJETS ALÉATOIRES
========================================================= */
function initRandomProjects() {
    const randomProjectsContainer = document.getElementById("random-projects");
    const currentProject = document.body.dataset.projectCurrent;

    if (!randomProjectsContainer) return;
    if (randomProjectsContainer.dataset.randomBound) return;

    randomProjectsContainer.dataset.randomBound = "true";

    const projects = [
    {
        url: "projet1.html",
        title: "Pomjeannais Basket Club — Une saison, une identité",
        image: "assets/img/heroprojet1.jpeg",
        tags: ["Identité visuelle", "Communication digitale"]
    },
    {
        url: "projet2.html",
        title: "Course de Côte de La Pommeraye — L'image à grande vitesse",
        image: "assets/img/heroprojet2.jpeg",
        tags: ["Direction artistique", "Communication événementielle"]
    },
    {
        url: "projet3.html",
        title: "Isidor Studio — Une identité qui se porte",
        image: "assets/img/heroprojet3.jpeg",
        tags: ["Direction artistique", "Mise en valeur produit"]
    },
    {
        url: "projet4.html",
        title: "Pomjeannais Basket Club — Une finale, tout un club",
        image: "assets/img/heroprojet4.png",
        tags: ["Communication événementielle", "Identité visuelle"]
    }
    ];

    const shuffleArray = (array) => {
        const newArray = [...array];

        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }

        return newArray;
    };

    const filteredProjects = projects.filter((project) => project.url !== currentProject);
    const selectedProjects = shuffleArray(filteredProjects).slice(0, 2);

    randomProjectsContainer.innerHTML = selectedProjects.map((project, index) => `
        <a href="${project.url}" class="project-card-page project-card-page-detailed reveal-on-scroll ${index === 0 ? "reveal-left" : "reveal-right"}">
            <div class="project-card-page-media">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-card-content project-card-content-visible">
                <h3>${project.title}</h3>
                <div class="project-inline-buttons">
                    ${project.tags.map((tag) => `
                        <button class="btn btn-hero small-btn" type="button">
                            <span>${tag}</span>
                            <span class="btn-fill-line"></span>
                        </button>
                    `).join("")}
                </div>
            </div>
        </a>
    `).join("");

    initRevealAnimations();
}

/* =========================================================
   HOME STACK GSAP
========================================================= */
function initHomeStack() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    const scene = document.querySelector(".home-stack-scene");
    const panels = gsap.utils.toArray(".home-stack-panel");

    if (!scene || panels.length < 2) return;
    if (scene.dataset.homeStackBound) return;

    scene.dataset.homeStackBound = "true";

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1
        }
    });

    panels.forEach((panel, index) => {
        if (index === 0) return;

        tl.to(panel, {
            yPercent: -100,
            ease: "none",
            duration: 1
        });
    });
}

/* =========================================================
   CARTES PROJETS HOME
========================================================= */
function initProjectCards() {
    document.querySelectorAll(".project-card-stack").forEach((card) => {
        if (card.dataset.cardBound) return;

        card.dataset.cardBound = "true";

        card.addEventListener("click", function () {
            const radioId = this.getAttribute("for");
            const radio = document.getElementById(radioId);

            if (radio && radio.checked) {
                const link = this.dataset.link;

                if (link) {
                    window.location.href = link;
                }
            }
        });
    });
}

/* =========================================================
   INIT GLOBAL
========================================================= */
function initSite() {
    initHeader();
    initActiveMenu();
    initRevealAnimations();
    initAOS();
    initSplitText();
    initProjectBannerScroll();
    initRandomProjects();
    initHomeStack();
    initProjectCards();
}

document.addEventListener("DOMContentLoaded", initSite);
document.addEventListener("includes:loaded", initSite);