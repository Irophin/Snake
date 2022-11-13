export function drawCell(context, x, y, cellSize, radius) {
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

export function drawEmptyCell(context, x, y, cellSize, radius) {
	context.fillStyle = 'rgba(93, 234, 142)';
	drawCell(context, x, y, cellSize, radius);
}

export function drawBoard(context, boardSize, cellSize, radius) {

	for (let i = 0; i < boardSize / cellSize; i++) {

		for (let j = 0; j < boardSize / cellSize; j++) {

			drawEmptyCell(context, i * cellSize, j * cellSize, cellSize, radius);

		}

	}

}

export function drawSnakeBody(context, x, y, cellSize, radius) {
	context.fillStyle = 'rgb(169,0,12)';
	drawCell(context, x, y, cellSize, radius);
}

export function drawSnakeHead(context, x, y, cellSize, radius, vertical = true) {
	context.fillStyle = 'rgba(0, 117, 40)';
	drawCell(context, x, y, cellSize, radius);

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

export function drawSnake(context, snakePositions, cellSize, radius, direction) {

	let head = snakePositions[0];
	drawSnakeHead(context, head.x, head.y, cellSize, radius, ['Right', 'Left'].includes(direction));

	for (let i = 1; i < snakePositions.length; i++) {
		let body = snakePositions[i];
		drawSnakeBody(context, body.x, body.y, cellSize, radius);
	}

}
