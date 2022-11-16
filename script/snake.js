import {drawBoard, drawSnake} from "./draw.js";
import {loadConfiguration} from "./configuration.js";
import {keyPressed, moveSnake} from "./game.js";

// -------------------------------
//			Variables
// -------------------------------

let configuration = await loadConfiguration('medium');
let board = document.querySelector('#board');
let boardSize = board.getAttribute('height')
let direction = 'Right';
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

let cellSize = Math.round(boardSize / configuration.dimensions);
let snake = configuration.snake;
let delay = configuration.delay;
let walls = configuration.walls;
let food = configuration.food;

// -------------------------------
//			Main script
// -------------------------------

let context = board.getContext('2d');
drawBoard(context, boardSize, cellSize, walls, food);

drawSnake(context, snake, cellSize, direction);
window.addEventListener("keydown", (event) => direction = keyPressed(event, direction, binds));
setInterval(() => moveSnake(context, snake, cellSize, direction, boardSize), delay)
