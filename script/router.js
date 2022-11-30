import {Snake} from "./Snake.js";

async function routeur() {

    snake.exitGame();
    await snake.updatesLevels();

    let url = window.location.hash;

    if (url.match(/^#level-[0-9]*$/)) {

        let valid = await snake.openGame(url);

        if (!valid) {
            alert("Aucune carte trouvée");
        }

        return;
    }

    document.location.href = "#";

    await snake.openMenu();
}

const snake = new Snake();
window.addEventListener("hashchange", routeur);
await routeur();
