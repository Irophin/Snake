import {Coordinate} from "../utils/Coordinate.js";
import {MapElements} from "../utils/MapElements.js";

export class Board {

	context;
	canvas;
	map;
	heightNumber;
	widthNumber;

	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.apple = document.createElement('img');
		this.apple.src = 'images/pomme.png';

		this.wall = document.createElement('img');
		this.wall.src = 'images/wall.png';
	}

	setMap(map) {
		this.map = map;
		this.updateBoardSize();
	}

	updateBoardSize() {

		this.heightNumber = this.map.length;
		this.widthNumber = this.map[0].length;

		let ratio = this.heightNumber/this.widthNumber;
		let PageRatio = window.innerHeight/window.innerWidth

		let width;
		let height;

		if (ratio < PageRatio) {
			width = window.innerWidth*0.9;
		} else {
			height = window.innerHeight*0.6;
	 		width = height/ratio;
		}

		this.cellSize = Math.floor(width / this.widthNumber);

		this.canvas.width = this.cellSize * this.widthNumber;
		this.canvas.height = this.cellSize * this.heightNumber;
	}

	async initBoard(delay) {
		let cells = [];
		for (let i = 0; i < this.heightNumber; i++) {
			for (let j = 0; j < this.widthNumber; j++) {
				cells.push([i,j,this.map[i][j]]);
			}
		}

		let time = 10;
		let display = cells.length/(delay/time);

		while (cells.length>0) {
			
			let promise = new Promise((resolve) => {
				setTimeout(() => {
					for (let i = 0; i < display; i++) {
						if (cells.length===0)
							break;

						let randomcell = cells.splice(Math.floor(Math.random() * cells.length),1)[0];
						
						let coords = new Coordinate(randomcell[1], randomcell[0]);
		
						if (randomcell[2] === MapElements.WALL) {
							this.drawWall(coords);
						} else if (randomcell[2] === MapElements.FOOD) {
							this.drawFood(coords);
						} else if (randomcell[2] === MapElements.EMPTY) {
							this.drawEmptyCell(coords);
						} else if (randomcell[2] === MapElements.SNAKE) {
							this.drawSnakeBody(coords);
						}
					}
					resolve();
				}, time);
			});

			await promise;
		}
	}	

	drawBoard() {
		for (let i = 0; i < this.heightNumber; i++) {
			for (let j = 0; j < this.widthNumber; j++) {

				let coords = new Coordinate(j, i);

				if (this.map[i][j] === MapElements.WALL) {
					this.drawWall(coords);
				} else if (this.map[i][j] === MapElements.FOOD) {
					this.drawFood(coords);
				} else if (this.map[i][j] === MapElements.SNAKE) {
					this.drawSnakeBody(coords);
				} else {
					this.drawEmptyCell(coords);
				}
			}
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
		this.context.drawImage(this.wall, coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawFood(coords) {
		this.drawEmptyCell(coords);
		this.context.drawImage(this.apple, coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	getDirection(snake, indice){

		let partDirection;
		let snakePart = snake[indice];

		partDirection = new Coordinate(snake[indice - 1].x - snakePart.x , snake[indice - 1].y - snakePart.y);

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

	drawSnake(snake, headDirection, ratio = 0) {		
		let head = snake[0];

		for (let i = 1; i < snake.length-1; i++) {
			this.drawSnakeBody(snake[i]);
		}

		this.drawSnakeTail(snake, ratio);
		this.drawSnakeHead(head, headDirection, ratio);
	}

	drawSnakeHead(position, direction, ratio) {

		let coords = {...position}
		let shift = new Coordinate(0, 0);
		let eye;

		switch (direction) {
			case 'Right':
				shift.y = this.cellSize / 4.5;
				coords.x -= (1-ratio);
				break;
			case 'Left':
				shift.y = this.cellSize / 4.5;
				coords.x += (1-ratio);
				break;
			case 'Top':
				shift.x = this.cellSize / 4.5;
				coords.y += (1-ratio);
				break;
			case 'Bottom':
				shift.x = this.cellSize / 4.5;
				coords.y -= (1-ratio);
				break;
			default:
				console.log('error direction Head');
		}

		eye = new Coordinate( coords.x * this.cellSize + this.cellSize / 2,
			  				  coords.y * this.cellSize + this.cellSize / 2);

		this.context.fillStyle = 'rgb(94, 128, 0)';
		this.context.fillRect(coords.x* this.cellSize, coords.y* this.cellSize, this.cellSize, this.cellSize);

		this.context.fillStyle = 'rgb(0,100,0)';
		this.context.beginPath();
		this.context.arc(eye.x - shift.x, eye.y - shift.y, this.cellSize / 7.8, 0, Math.PI * 2, true);
		this.context.arc(eye.x + shift.x, eye.y + shift.y, this.cellSize / 7.8, 0, Math.PI * 2, true);

		this.context.fill();
	}

	drawSnakeBody(coords) {
		this.context.fillStyle = 'rgb(103, 140, 1)';
		this.context.fillRect(coords.x * this.cellSize, coords.y * this.cellSize, this.cellSize, this.cellSize);
	}

	drawSnakeTail(snake, ratio) {

		let tail = {...snake.at(-1)};
		let direction = this.getDirection(snake, snake.length-1);

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

	isInsideBoard(head) {
		let cellCount = this.boardSize / this.cellSize;
		return 0 <= head.x && head.x < cellCount
			&& 0 <= head.y && head.y < cellCount;
	}
}