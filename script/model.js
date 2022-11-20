export class Coordinate {

	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class SnakeConfiguration {

	dimensions;
	delay;
	walls;
	foods;
	snake;

	constructor(dimensions, delay, walls, foods, snake) {
		this.dimensions = dimensions;
		this.delay = delay;
		this.walls = walls;
		this.foods = foods;
		this.snake = snake;
	}

	static from(json) {

		return new SnakeConfiguration(
			json.dimensions[0],
			json.delay,
			json.walls.map((position) => new Coordinate(position[0], position[1])),
			json.food.map((position) => new Coordinate(position[0], position[1])),
			json.snake.map((position) => new Coordinate(position[0], position[1]))
		);
	}

}

export class SnakeGame {

	snake;
	walls;
	foods;
	delay;
	direction;
	binds;
	board;
	interval;

	turning = false;

	constructor(snake, walls, foods, delay, direction, binds, board) {
		this.snake = snake;
		this.walls = walls;
		this.foods = foods;
		this.delay = delay;
		this.direction = direction;
		this.binds = binds;
		this.board = board;
	}

	start() {
		this.board.drawBoard(this.walls, this.foods);
		this.board.drawSnake(this.snake, this.direction);
		this.updateScore();
		this.interval = setInterval(() => this.moveSnake(), this.delay)
	}

	keyPressed(event) {
		
		if (this.turning){
			return;
		}
		this.turning = true;

		for (let i = 0; i < this.binds.length; i++) {

			if (this.binds[i].keys.includes(event.key)) {
				if(this.direction != this.binds[i].deadDirection){
					this.direction = this.binds[i].direction;
				}
			}
		}
	}

	moveSnake() {

		let head =  { ...this.snake[0] };

		switch (this.direction) {

			case 'Right':
				head.x += 1;
				break;

			case 'Left':
				head.x -= 1;
				break;

			case 'Top':
				head.y -= 1;
				break;

			case 'Bottom':
				head.y += 1;
				break;

		}

		this.snake.unshift(head);

		if(this.isFood(head)){
			this.foods.splice(this.foods.indexOf(head), 1);
			this.generateFood();
			this.board.drawBoard(this.walls, this.foods);
			this.updateScore();
		}else{
			this.board.drawEmptyCell(this.snake.pop());
		}

		if (!this.board.isInsideBoard(head) || this.isWall(head) || this.isSnake(head,true)) {
			clearInterval(this.interval);
			alert('Game over');
			return;
		}

		this.board.drawSnake(this.snake, this.direction);
		this.turning = false;
	}

	isWall(head) {
		return this.walls.some(wall => {
			return wall.x === head.x && wall.y === head.y
		});
	}

	isSnake(head, ignoreHead = false) {
		let i = ignoreHead ? 1 : 0;
		for (i; i < this.snake.length; i++) {
			if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
				return true;
			}
		}
		return false;
	}

	isFood(head) {
		return this.foods.some(food => {
			return food.x === head.x && food.y === head.y
		});
	}

	generateFood() {
		let coords;

		do {
			coords = new Coordinate(Math.floor(Math.random() * this.board.cellNumber), Math.floor(Math.random() * this.board.cellNumber));
		} while (this.isWall(coords) || this.isSnake(coords) || this.isFood(coords));

		this.foods.push(coords);
	}

	updateScore() {
		document.getElementById('score-value').textContent = this.snake.length;
	}

}

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
