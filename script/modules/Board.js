import {Coordinate} from "../utils/Coordinate.js";

export class Board {

	context;
	boardSize;
	cellSize;
	cellNumber;

	constructor(context, boardSize, cellSize) {
		this.context = context;
		this.boardSize = boardSize;
		this.cellSize = cellSize;
		this.updateBoardSize();
	}

	updateBoardSize() {
		this.cellNumber = this.boardSize / this.cellSize;
	}

	initBoard(delay) {
		let cells = [];
		for (let i = 0; i < this.cellNumber; i++) {
			for (let j = 0; j < this.cellNumber; j++) {
				cells.push(new Coordinate(i, j));
			}
		}

		while (cells.length>0) {
			let randomcell = cells.splice(Math.floor(Math.random() * cells.length),1)[0];
			setTimeout(() => {
				this.drawEmptyCell(randomcell);	
			}, Math.floor(Math.random() * delay));
		}
	}	

	drawBoard(walls, foods) {

		this.updateBoardSize();

		for (let i = 0; i < this.cellNumber; i++) {

			for (let j = 0; j < this.cellNumber; j++) {

				this.drawEmptyCell(new Coordinate(i, j));

			}

		}

		for (let i = 0; i < walls.length; i++) {
			this.drawWall(walls[i]);
		}

		for (const food of foods) {
			this.drawFood(food);
		}
	}

	drawEmptyCell(coords) {
		if (coords.x%2 === 0 && coords.y%2 === 0 || coords.x%2 === 1 && coords.y%2 === 1) {
			this.context.fillStyle = 'rgb(170, 215, 81';
		}else{
			this.context.fillStyle = 'rgb(162, 209, 73)';
		}
		
		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawWall(coords) {
		this.context.fillStyle = 'rgb(72, 72, 72)';
		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawFood(coords) {
		this.context.beginPath();
		this.context.fillStyle = 'rgb(207, 19, 12)';

		const middle = new Coordinate(coords.x * this.cellSize + this.cellSize / 2, coords.y * this.cellSize + this.cellSize / 2);

		this.context.arc(middle.x, middle.y, this.cellSize / 2, 0, 2 * Math.PI);
		this.context.fill();
	}

	drawSnake(snake, direction) {

		let head = snake[0];
		this.drawSnakeHead(head, ['Right', 'Left'].includes(direction));

		for (let i = 1; i < snake.length; i++) {
			let body = snake[i];
			this.drawSnakeBody(body);
		}

	}

	drawSnakeHead(coords, vertical = true) {
		this.context.fillStyle = 'rgb(94, 128, 0)';
		this.context.fillRect(coords.x* this.cellSize, coords.y* this.cellSize, this.cellSize, this.cellSize);

		this.context.fillStyle = 'rgb(169,0,12)';
		let eyeX = coords.x * this.cellSize + this.cellSize / 2;
		let eyeY = coords.y * this.cellSize + this.cellSize / 2;
		let shiftX = (vertical ? 0 : 1) * this.cellSize / 4;
		let shiftY = (vertical ? 1 : 0) * this.cellSize / 4;
		this.context.beginPath();
		this.context.arc(eyeX - shiftX, eyeY - shiftY, this.cellSize / 7, 0, Math.PI * 2, true);
		this.context.arc(eyeX + shiftX, eyeY + shiftY, this.cellSize / 7, 0, Math.PI * 2, true);
		this.context.fill();
	}

	drawSnakeBody(coords) {
		this.context.fillStyle = 'rgb(103, 140, 1)';
		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	isInsideBoard(head) {
		let cellCount = this.boardSize / this.cellSize;
		return 0 <= head.x && head.x < cellCount
			&& 0 <= head.y && head.y < cellCount;
	}
}