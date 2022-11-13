import {drawBoard, drawEmptyCell, drawSnake} from "./drawer.js";

// -------------------------------
//			Classes
// -------------------------------

class Position {

	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	copy() {
		return new Position(this.x, this.y);
	}

}

// -------------------------------
//			Functions
// -------------------------------

function keyPressed(event, direction, binds) {

	for (let i = 0; i < binds.length; i++) {

		if (binds[i].keys.includes(event.code)) {
			return binds[i].direction;
		}

	}

	return direction;
}

function moveSnake(context, snakePositions, cellSize, radius, direction) {

	for (let i = 0; i < snakePositions.length; i++) {
		let toEmpty = snakePositions[i];
		drawEmptyCell(context, toEmpty.x, toEmpty.y, cellSize, radius);
	}

	let move = [0, 0];

	switch (direction) {

		case 'Right':
			move = [cellSize, 0];
			break;

		case 'Left':
			move = [-cellSize, 0];
			break;

		case 'Top':
			move = [0, -cellSize];
			break;

		case 'Bottom':
			move = [0, cellSize];
			break;

	}

	let head = snakePositions[0].copy();
	head.x = head.x + move[0];
	head.y = head.y + move[1];

	let result = false;

	if (0 <= head.x && head.x < boardSize && 0 <= head.y && head.y < boardSize) {

		for (let i = snakePositions.length - 1; i > 0; i--) {
			snakePositions[i] = snakePositions[i - 1];
		}
		snakePositions[0] = head;
		result = true;
	}

	drawSnake(context, snakePositions, cellSize, radius, direction);
	return result;
}

// -------------------------------
//			Variables
// -------------------------------

let board = document.querySelector('#board');
let boardSize = board.getAttribute('height')
let cellCountBySide = 25;
let cellSize = Math.round(boardSize / cellCountBySide);
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

let radius = 7;
let middle = Math.round(boardSize / cellSize / 2);
let snakePositions = [new Position((middle - 1) * cellSize, (middle - 1) * cellSize)]

let direction = 'Right';

// -------------------------------
//			Main script
// -------------------------------

if (!board.getContext) {
	alert('Une erreur s\'est produite');
	stop();
}
let context = board.getContext('2d');
drawBoard(context, boardSize, cellSize, radius);

drawSnake(context, snakePositions, cellSize, radius, direction);

window.addEventListener("keydown", (event) => direction = keyPressed(event, direction, binds));
setInterval(() => moveSnake(context, snakePositions, cellSize, radius, direction), 150)
