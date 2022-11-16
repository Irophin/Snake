import {loadConfiguration} from "./configuration.js";
import {Board, SnakeGame} from "./model.js";

// -------------------------------
//			Variables
// -------------------------------

let configuration = await loadConfiguration('medium');
let board = document.querySelector('#board');
let binds = [
	{
		'direction': 'Top',
		'keys': ['ArrowUp', 'KeyA', 'KeyQ']
	},
	{
		'direction': 'Bottom',
		'keys': ['ArrowDown', 'KeyS']
	},
	{
		'direction': 'Left',
		'keys': ['ArrowLeft', 'KeyQ']
	},
	{
		'direction': 'Right',
		'keys': ['ArrowRight', 'KeyD']
	}
]

// -------------------------------
//			Main script
// -------------------------------

let boardSize = board.getAttribute('height')
let drawer = new Board(board.getContext('2d'), boardSize, Math.round(boardSize / configuration.dimensions));
let game = new SnakeGame(configuration.snake, configuration.walls, configuration.food, configuration.delay, 'Right', binds, drawer);

game.start();

window.addEventListener("keydown", (event) => game.keyPressed(event));
