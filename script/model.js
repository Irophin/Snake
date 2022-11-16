export class SnakePosition {

	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(toAdd) {
		return new SnakePosition(this.x + toAdd[0], this.y + toAdd[1]);
	}

}

export class SnakeConfiguration {

	dimensions;
	delay;
	walls;
	food;
	snake;

	constructor(dimensions, delay, walls, food, snake) {
		this.dimensions = dimensions;
		this.delay = delay;
		this.walls = walls;
		this.food = food;
		this.snake = snake;
	}

	static from(json) {

		return new SnakeConfiguration(
			json.dimensions[0],
			json.delay,
			json.walls.map((position) => new SnakePosition(position[0], position[1])),
			new SnakePosition(json.food[0][0], json.food[0][1]),
			json.snake.map((position) => new SnakePosition(position[0], position[1]))
		);
	}

}

export class SnakeGame {

	snake;
	walls;
	food;
	delay;
	direction;
	binds;
	board;

	constructor(snake, walls, food, delay, direction, binds, board) {
		this.snake = snake;
		this.walls = walls;
		this.food = food;
		this.delay = delay;
		this.direction = direction;
		this.binds = binds;
		this.board = board;
	}

	start() {
		this.board.drawBoard(this.walls, this.food);
		this.board.drawSnake(this.snake, this.direction);
		setInterval(() => this.moveSnake(), this.delay)
	}

	keyPressed(event) {

		for (let i = 0; i < this.binds.length; i++) {

			if (this.binds[i].keys.includes(event.code)) {
				this.direction = this.binds[i].direction;
			}

		}

	}

	moveSnake() {

		for (let i = 0; i < this.snake.length; i++) {
			let toEmpty = this.snake[i];
			this.board.drawEmptyCell(toEmpty.x, toEmpty.y);
		}

		let move = [0, 0];

		switch (this.direction) {

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

		let head = this.snake[0].add(move);

		if (this.board.isInsideBoard(head) && !this.isWall(head) && !this.isSnake(head)) {

			for (let i = this.snake.length - 1; i > 0; i--) {
				this.snake[i] = this.snake[i - 1];
			}

			this.snake[0] = head;
		}

		this.board.drawSnake(this.snake, this.direction);
	}

	isWall(head) {
		return this.walls.some(wall => wall.x === head.x && wall.y === head.y);
	}

	isSnake(head) {
		return this.snake.some(snake => snake.x === head.x && snake.y === head.y);
	}

}

export class Board {

	context;
	boardSize;
	cellSize;

	constructor(context, boardSize, cellSize) {
		this.context = context;
		this.boardSize = boardSize;
		this.cellSize = cellSize;
	}

	drawBoard(walls, food) {

		for (let i = 0; i < this.boardSize / this.cellSize; i++) {

			for (let j = 0; j < this.boardSize / this.cellSize; j++) {

				this.drawEmptyCell(i, j);

			}

		}

		for (let i = 0; i < walls.length; i++) {
			this.drawWall(walls[i].x, walls[i].y);
		}

		this.drawFood(food.x, food.y);

	}

	drawEmptyCell(x, y) {
		this.context.fillStyle = 'rgba(93, 234, 142)';
		this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawWall(x, y) {
		this.context.fillStyle = 'rgb(72, 72, 72)';
		this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawFood(x, y) {
		this.context.fillStyle = 'rgb(255, 215, 0)';
		this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawSnake(snake, direction) {

		let head = snake[0];
		this.drawSnakeHead(head.x, head.y, ['Right', 'Left'].includes(direction));

		for (let i = 1; i < snake.length; i++) {
			let body = snake[i];
			this.drawSnakeBody(body.x, body.y);
		}

	}

	drawSnakeHead(x, y, vertical = true) {
		this.context.fillStyle = 'rgba(0, 117, 40)';
		this.context.fillRect(x* this.cellSize, y* this.cellSize, this.cellSize, this.cellSize);

		this.context.fillStyle = 'rgb(169,0,12)';
		let eyeX = x * this.cellSize + this.cellSize / 2;
		let eyeY = y * this.cellSize + this.cellSize / 2;
		let shiftX = (vertical ? 0 : 1) * this.cellSize / 4;
		let shiftY = (vertical ? 1 : 0) * this.cellSize / 4;
		this.context.beginPath();
		this.context.arc(eyeX - shiftX, eyeY - shiftY, this.cellSize / 7, 0, Math.PI * 2, true);
		this.context.arc(eyeX + shiftX, eyeY + shiftY, this.cellSize / 7, 0, Math.PI * 2, true);
		this.context.fill();
	}

	drawSnakeBody(x, y) {
		this.context.fillStyle = 'rgb(169,0,12)';
		this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	}

	isInsideBoard(head) {
		let cellCount = this.boardSize / this.cellSize;
		return 0 <= head.x && head.x < cellCount
			&& 0 <= head.y && head.y < cellCount;
	}

}
