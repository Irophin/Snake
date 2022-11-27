import {Snake} from "./Snake.js";

async function routeur() {

	snake.exitGame();
	await snake.updatesLevels();

	let url = window.location.hash;

	if (url.match(/^#level-[0-9]*$/)) {

		let valid = await snake.openGame(url)
		
		if (valid){
			return
		}else{
			alert("Aucune carte trouvée");
		}
	}

	document.location.href = "#";

	snake.openMenu()
}

window.addEventListener("hashchange", routeur);

const snake = new Snake();

routeur();
