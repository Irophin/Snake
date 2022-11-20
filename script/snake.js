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

// -------------------------------
//			Main script
// -------------------------------

let boardSize = board.getAttribute('height')
let drawer = new Board(board.getContext('2d'), boardSize, Math.round(boardSize / configuration.dimensions));
let game = new SnakeGame(configuration.snake, configuration.walls, configuration.foods, configuration.delay, 'Right', binds, drawer);

game.start();

window.addEventListener("keydown", (event) => game.keyPressed(event));
