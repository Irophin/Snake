import {mainGame} from "./Main.js";

function home() {
	let container = document.getElementById("container");
	let template = document.getElementById("home-template");
	let clone = template.content.cloneNode(true);
	container.innerHTML = "";
	container.appendChild(clone);
}

function routeur() {

	let url = window.location.hash.slice(1);

	if (url.startsWith("snake")) {
		mainGame(url.slice(6));
		return
	}

	home();
}

window.addEventListener("hashchange", routeur);

routeur();
