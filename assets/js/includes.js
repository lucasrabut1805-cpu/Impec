document.addEventListener("DOMContentLoaded", async () => {
    const includeElements = document.querySelectorAll("[data-include]");

    for (const element of includeElements) {
        const file = element.getAttribute("data-include");

        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Impossible de charger ${file}`);
            }

            const content = await response.text();
            element.innerHTML = content;
        } catch (error) {
            console.error(error);
            element.innerHTML = `<p style="color:red;">Erreur de chargement : ${file}</p>`;
        }
    }

    setTimeout(() => {
        const currentPage = document.body.dataset.page;
        const navLinks = document.querySelectorAll(".nav-list a");

        navLinks.forEach((link) => {
            if (link.dataset.link === currentPage) {
                link.classList.add("active");
            }
        });
    }, 50);

    if (window.AOS) {
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

    if (window.gsap && window.SplitText) {
        gsap.registerPlugin(SplitText);

        document.querySelectorAll(".js-split-words").forEach((element, index) => {
            const split = SplitText.create(element, {
                type: "words"
            });

            gsap.from(split.words, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.06,
                delay: 0.15 + (index * 0.12)
            });
        });
    }
})