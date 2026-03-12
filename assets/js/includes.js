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

    // Petit délai pour être sûr que le header injecté est bien présent
    setTimeout(() => {
        const currentPage = document.body.dataset.page;
        const navLinks = document.querySelectorAll(".nav-list a");

        navLinks.forEach((link) => {
            if (link.dataset.link === currentPage) {
                link.classList.add("active");
            }
        });
    }, 50);
});