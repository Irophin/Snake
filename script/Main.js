import {SnakeConfiguration} from "./modules/SnakeConfiguration.js";
import {Board} from "./modules/Board.js";
import {SnakeGame} from "./modules/SnakeGame.js";

export async function mainGame(mode) {

	let container = document.getElementById("container");
	let template = document.getElementById("game-template");
	let clone = template.content.cloneNode(true);
	container.innerHTML = "";
	container.appendChild(clone);

	// -------------------------------
	//			Variables
	// -------------------------------

	let binds = [
		{
			'direction': 'Top',
			'deadDirection': 'Bottom',
			'keys': ['ArrowUp', 'z']
		},
		{
			'direction': 'Bottom',
			'deadDirection': 'Top',
			'keys': ['ArrowDown', 's']
		},
		{
			'direction': 'Left',
			'deadDirection': 'Right',
			'keys': ['ArrowLeft', 'q']
		},
		{
			'direction': 'Right',
			'deadDirection': 'Left',
			'keys': ['ArrowRight', 'd']
		}
	]

	let popUp = {
		conteneur: document.querySelector('.popup-play'),
		title: document.querySelector('.title'),
		play: document.querySelector('.play'),
		size: document.querySelector('.size'),
		speed: document.querySelector('.speed'),
		score: document.querySelector('.score-value'),
	}

	let configuration = await SnakeConfiguration.loadConfiguration(mode);
	let canvas = document.querySelector('#board');

	// -------------------------------
	//		  Event listeners
	// -------------------------------

	window.addEventListener("keydown", (event) => game.keyPressed(event));
	window.addEventListener("resize", () => game.resize());

	// -------------------------------
	//			Main script
	// -------------------------------

	let game = new SnakeGame(configuration, binds, new Board(canvas), popUp);

}
