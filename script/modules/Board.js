import {Coordinate} from "../utils/Coordinate.js";
import {MapElements} from "../utils/MapElements.js";

/**
 * Represents the game board and manages it.
 */
export class Board {

	// context;
	// canvas;
	// map;
	// heightNumber;
	// widthNumber;

	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.apple = document.createElement('img');
		this.apple.src = 'images/pomme.png';

		this.wall = document.createElement('img');
		this.wall.src = 'images/wall.png';
	}

	/**
	 * Reset the board to given map.
	 *
	 * @param map The map to use.
	 */
	setMap(map) {
		this.map = map;
		this.updateBoardSize();
	}

	/**
	 * Calculate the size of the board based on the ratio of the screen.
	 * If the ratio isn't good enough, the board will be resized to fit the screen.
	 */
	updateBoardSize() {

		this.heightNumber = this.map.length;
		this.widthNumber = this.map[0].length;

		let ratio = this.heightNumber / this.widthNumber;
		let pageRatio = window.innerHeight / window.innerWidth;

		let width = window.innerWidth * 0.9;

		if (pageRatio <= ratio) {
			let height = window.innerHeight * 0.6;
			width = height / ratio;
		}

		this.cellSize = Math.floor(width / this.widthNumber);

		this.canvas.width = this.cellSize * this.widthNumber;
		this.canvas.height = this.cellSize * this.heightNumber;
	}

	/**
	 * Initializes the board.
	 *
	 * Reveals the board by drawing it cell by cell.
	 *
	 * @param revealTime The complete time to reveal the board.
	 * @param revealDelay The delay between each cell.
	 * @returns {Promise<void>} A promise that will be resolved when the board is revealed.
	 */
	async initBoard(revealTime = 500, revealDelay = 10) {
		let cells = [];

		for (let i = 0; i < this.heightNumber; i++) {
			for (let j = 0; j < this.widthNumber; j++) {
				cells.push([i, j, this.map[i][j]]);
			}
		}

		let cellToDisplay = revealDelay * cells.length / revealTime;

		while (0 < cells.length) {
			await new Promise(this.drawRandomCell(cellToDisplay, cells, revealDelay));
		}
	}

	/**
	 * Draw random cells from the given array.
	 *
	 * @param cellToDisplay The number of cells to display.
	 * @param cells The cells to display.
	 * @param time The time to wait before next display.
	 * @returns {(function(*): void)|*} A function that will be called by the promise.
	 */
	drawRandomCell(cellToDisplay, cells, time) {
		return (resolve) => {
			setTimeout(() => {
				for (let i = 0; i < cellToDisplay; i++) {
					if (cells.length === 0) {
						break;
					}

					let randomCell = cells.splice(Math.floor(Math.random() * cells.length), 1)[0];

					let coords = new Coordinate(randomCell[1], randomCell[0]);

					switch (randomCell[2]) {
						case MapElements.WALL:
							this.drawWall(coords);
							break;

						case MapElements.FOOD:
							this.drawFood(coords);
							break;

						case MapElements.SNAKE:
							this.drawSnakeBody(coords);
							break;

						case MapElements.EMPTY:
						default:
							this.drawEmptyCell(coords);
							break;
					}

				}
				resolve();
			}, time);
		};
	}

	/**
	 * Draw the board with all the elements.
	 */
	drawBoard() {
		for (let i = 0; i < this.heightNumber; i++) {
			for (let j = 0; j < this.widthNumber; j++) {

				let coords = new Coordinate(j, i);

				switch (this.map[i][j]) {
					case MapElements.WALL:
						this.drawWall(coords);
						break;

					case MapElements.FOOD:
						this.drawFood(coords);
						break;

					case MapElements.SNAKE:
						this.drawSnakeBody(coords);
						break;

					case MapElements.EMPTY:
					default:
						this.drawEmptyCell(coords);
						break;
				}

			}
		}
	}

	/**
	 * Draw an empty cell.
	 *
	 * It will alternate the color of the cell to make it more visible.
	 *
	 * @param coords The coordinates of the cell.
	 */
	drawEmptyCell(coords) {

		this.context.fillStyle = 'rgb(162, 209, 73)';

		if (coords.x % 2 === 0 && coords.y % 2 === 0 || coords.x % 2 === 1 && coords.y % 2 === 1) {
			this.context.fillStyle = 'rgb(170, 215, 81';
		}

		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	/**
	 * Draw a wall.
	 *
	 * @param coords The coordinates of the cell.
	 */
	drawWall(coords) {
		this.context.drawImage(this.wall, coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	/**
	 * Draw food.
	 *
	 * @param coords The coordinates of the cell.
	 */
	drawFood(coords) {
		this.drawEmptyCell(coords);
		this.context.drawImage(this.apple, coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	/**
	 * Get the current snake direction.
	 *
	 * @param snake The snake.
	 * @returns {string} The direction.
	 */
	getDirection(snake){

		let snakePart = snake[snake.length - 1];
		let partDirection = new Coordinate(snake[snake.length - 2].x - snakePart.x , snake[snake.length - 2].y - snakePart.y);

		switch (true){
			case partDirection.x === 0 && partDirection.y === -1:
				return 'Top';
			case partDirection.x === 0 && partDirection.y === 1:
				return 'Bottom';
			case partDirection.x === 1 && partDirection.y === 0:
				return 'Right';
			case partDirection.x === -1 && partDirection.y === 0:
				return 'Left';
			default:
				console.log('error switch getDirection');
		}

	}

	/**
	 * Draw the snake.
	 *
	 * @param snake The snake.
	 * @param headDirection The direction of the head.
	 * @param ratio The avancement of the snake on the current cell.
	 */
	drawSnake(snake, headDirection, ratio = 0) {
		let head = snake[0];

		for (let i = 1; i < snake.length - 1; i++) {
			this.drawSnakeBody(snake[i]);
		}

		this.drawSnakeTail(snake, ratio);
		this.drawSnakeHead(head, headDirection, ratio);
	}

	/**
	 * Draw the snake head.
	 *
	 * @param position The position of the head.
	 * @param direction The direction of the head.
	 * @param ratio The avancement of the snake on the current cell.
	 */
	drawSnakeHead(position, direction, ratio) {

		let coords = {...position};
		let shift = new Coordinate(0, 0);

		switch (direction) {
			case 'Right':
				shift.y = this.cellSize / 4.5;
				coords.x -= (1 - ratio);
				break;
			case 'Left':
				shift.y = this.cellSize / 4.5;
				coords.x += (1 - ratio);
				break;
			case 'Top':
				shift.x = this.cellSize / 4.5;
				coords.y += (1 - ratio);
				break;
			case 'Bottom':
				shift.x = this.cellSize / 4.5;
				coords.y -= (1 - ratio);
				break;
			default:
				console.log('error direction Head');
		}

		let eye = new Coordinate(coords.x * this.cellSize + this.cellSize / 2,
			coords.y * this.cellSize + this.cellSize / 2);

		this.context.fillStyle = 'rgb(94, 128, 0)';
		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);

		this.context.fillStyle = 'rgb(0,100,0)';
		this.context.beginPath();
		this.context.arc(eye.x - shift.x, eye.y - shift.y, this.cellSize / 7.8, 0, Math.PI * 2, true);
		this.context.arc(eye.x + shift.x, eye.y + shift.y, this.cellSize / 7.8, 0, Math.PI * 2, true);

		this.context.fill();
	}

	/**
	 * Draw the snake body.
	 *
	 * @param coords The coordinates of all the body parts.
	 */
	drawSnakeBody(coords) {
		this.context.fillStyle = 'rgb(103, 140, 1)';
		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	/**
	 * Draw the snake tail.
	 *
	 * The tail is the last part of the snake.
	 * It is drawn differently because of the fluid movement.
	 *
	 * @param snake The snake.
	 * @param ratio The avancement of the snake on the current cell.
	 */
	drawSnakeTail(snake, ratio) {

		let tail = {...snake.at(-1)};
		let direction = this.getDirection(snake);

		this.drawEmptyCell(tail);

		switch (direction) {
			case 'Right':
				tail.x += ratio;
				break;
			case 'Left':
				tail.x -= ratio;
				break;
			case 'Top':
				tail.y -= ratio;
				break;
			case 'Bottom':
				tail.y += ratio;
				break;
			default:
				console.log('error direction Tail');
		}

		this.drawSnakeBody(tail);
	}

}