export function drawEmptyCell(context, x, y, cellSize) {
	context.fillStyle = 'rgba(93, 234, 142)';
	context.fillRect(x, y, cellSize, cellSize);
}

export function drawWall(context, x, y, cellSize) {
	context.fillStyle = 'rgb(72, 72, 72)';
	context.fillRect(x, y, cellSize, cellSize);
}

export function drawFood(context, x, y, cellSize) {
	context.fillStyle = 'rgb(255, 215, 0)';
	context.fillRect(x, y, cellSize, cellSize);
}

export function drawBoard(context, boardSize, cellSize, walls, food) {

	for (let i = 0; i < boardSize / cellSize; i++) {

		for (let j = 0; j < boardSize / cellSize; j++) {

			drawEmptyCell(context, i * cellSize, j * cellSize, cellSize);

		}

	}

	for (let i = 0; i < walls.length; i++) {
		drawWall(context, walls[i].x * cellSize, walls[i].y * cellSize, cellSize);
	}

	drawFood(context, food.x * cellSize, food.y * cellSize, cellSize);
}

export function drawSnakeBody(context, x, y, cellSize) {
	context.fillStyle = 'rgb(169,0,12)';
	context.fillRect(x, y, cellSize, cellSize);
}

export function drawSnakeHead(context, x, y, cellSize, vertical = true) {
	context.fillStyle = 'rgba(0, 117, 40)';
	context.fillRect(x, y, cellSize, cellSize);

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

export function drawSnake(context, snake, cellSize, direction) {

	let head = snake[0];
	drawSnakeHead(context, head.x * cellSize, head.y * cellSize, cellSize, ['Right', 'Left'].includes(direction));

	for (let i = 1; i < snake.length; i++) {
		let body = snake[i];
		drawSnakeBody(context, body.x * cellSize, body.y * cellSize, cellSize);
	}

}
