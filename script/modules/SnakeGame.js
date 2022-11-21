import {Coordinate} from "../utils/Coordinate.js";
import {Board} from "../modules/Board.js";

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