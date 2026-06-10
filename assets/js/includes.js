document.addEventListener("DOMContentLoaded", async () => {
    const includeElements = document.querySelectorAll("[data-include]");

    for (const element of includeElements) {
        const file = element.getAttribute("data-include");

        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Impossible de charger ${file}`);
            }

            element.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
            element.innerHTML = `<p style="color:red;">Erreur de chargement : ${file}</p>`;
        }
    }

    document.dispatchEvent(new Event("includes:loaded"));
});