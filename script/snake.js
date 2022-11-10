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

	copy(otherPosition) {
		this.x = otherPosition.x;
		this.y = otherPosition.y;
	}

}

// -------------------------------
//			Functions
// -------------------------------

function drawCell(x, y) {
	context.beginPath();
	context.moveTo(x, y + radius);
	context.lineTo(x, y + cellSize - radius);
	context.quadraticCurveTo(x, y + cellSize, x + radius, y + cellSize);
	context.lineTo(x + cellSize - radius, y + cellSize);
	context.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize, y + cellSize - radius);
	context.lineTo(x + cellSize, y + radius);
	context.quadraticCurveTo(x + cellSize, y, x + cellSize - radius, y);
	context.lineTo(x + radius, y);
	context.quadraticCurveTo(x, y, x, y + radius);
	context.fill();
}

function drawEmptyCell(x, y) {
	context.fillStyle = 'rgba(93, 234, 142)';
	drawCell(x, y);
}

function drawBoard() {

	for (let i = 0; i < boardSize / cellSize; i++) {

		for (let j = 0; j < boardSize / cellSize; j++) {

			drawEmptyCell(i * cellSize, j * cellSize);

		}

	}

}

function drawSnakeBody(x, y) {
	context.fillStyle = 'rgb(169,0,12)';
	drawCell(x, y);
}

function drawSnakeHead(x, y, vertical = true) {
	context.fillStyle = 'rgba(0, 117, 40)';
	drawCell(x, y);

	context.fillStyle = 'rgb(169,0,12)';
	let eyeX = x + cellSize / 2;
	let eyeY = y + cellSize / 2;
	let shiftX = (vertical ? 0 : 1) * cellSize / 4;
	let shiftY = (vertical ? 1 : 0) * cellSize / 4;
	context.beginPath();
	context.arc(eyeX - shiftX, eyeY - shiftY, cellSize / 7, 0, Math.PI * 2, true);
	context.arc(eyeX + shiftX, eyeY + shiftY, cellSize / 7, 0, Math.PI * 2, true);
	context.fill();
}

function drawSnake() {

	let head = snakePositions[0];
	drawSnakeHead(head.x, head.y, ['Right', 'Left'].includes(direction));

	for (let i = 1; i < snakePositions.length; i++) {
		let body = snakePositions[i];
		drawSnakeBody(body.x, body.y)
	}

}

function keyPressed(event) {

	binds.filter((bind) => bind.keys.includes(event.code))
		.forEach((bind) => {
			direction = bind.direction
		})

}

function moveSnake() {

	for (let i = 0; i < snakePositions.length; i++) {
		let toEmpty = snakePositions[i];
		drawEmptyCell(toEmpty.x, toEmpty.y);
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

	for (let i = snakePositions.length - 1; i > 0; i--) {
		snakePositions[i] = snakePositions[i - 1];
	}

	let head = snakePositions[0];
	head.x = head.x + move[0];
	head.y = head.y + move[1];
	snakePositions[0] = head;
	drawSnake();
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
drawBoard(context, 20, 500, 7);

drawSnake();

window.addEventListener("keydown", keyPressed);
setInterval(moveSnake, 150)
