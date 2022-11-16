import {drawEmptyCell, drawSnake} from "./draw.js";

export function keyPressed(event, direction, binds) {

	for (let i = 0; i < binds.length; i++) {

		if (binds[i].keys.includes(event.code)) {
			return binds[i].direction;
		}

	}

	return direction;
}

export function moveSnake(context, snake, cellSize, direction, boardSize) {

	for (let i = 0; i < snake.length; i++) {
		let toEmpty = snake[i];
		drawEmptyCell(context, toEmpty.x * cellSize, toEmpty.y * cellSize, cellSize);
	}

	let move = [0, 0];

	switch (direction) {

		case 'Right':
			move = [1, 0];
			break;

		case 'Left':
			move = [-1, 0];
			break;

		case 'Top':
			move = [0, -1];
			break;

		case 'Bottom':
			move = [0, 1];
			break;

	}

	let head = snake[0].add(move);

	let result = false;

	if (0 <= head.x && head.x < boardSize / cellSize && 0 <= head.y && head.y < boardSize / cellSize) {

		for (let i = snake.length - 1; i > 0; i--) {
			snake[i] = snake[i - 1];
		}
		snake[0] = head;
		result = true;
	}

	drawSnake(context, snake, cellSize, direction);
	return result;
}