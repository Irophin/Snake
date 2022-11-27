import {Coordinate} from "../utils/Coordinate.js";
import {MapElements} from "../utils/MapElements.js";
import {Board} from "./Board.js";

export class SnakeGame {
	
	settings;
	
	snake;
	delay;
	direction;
	interval;

	board;
	map;
	
	popup;
	binds;
	turning = false;

	constructor(binds) {
		this.binds = binds;
	}

	initGame(canvas, popUp){
		this.board = new Board(canvas);
		this.popup = popUp;

		this.loadConfig(this.settings);
		this.initPopUp();

		this.board.setMap(this.map);	
		this.board.initBoard(500);
		this.board.drawSnake(this.snake, this.direction);
	}

	setSettings(settings){
		this.settings = settings
	}

	loadConfig(settings) {

		this.snake = [...settings.snake];
		this.delay = settings.delay;
		this.direction = settings.direction;
		this.map = [];

		for (let i = 0; i < settings.dimensions[0]; i++) {
			this.map.push([]);
			for (let j = 0; j < settings.dimensions[1]; j++) {
				this.map[i].push(MapElements.EMPTY);
			}
		}

		for (const { x, y } of settings.walls) {
			this.map[y][x] = MapElements.WALL;
		}

		for (const { x, y } of settings.foods) {
			this.map[y][x] = MapElements.FOOD;
		}

		for (const { x, y } of settings.snake) {	
			this.map[y][x] = MapElements.SNAKE;
		}
	}

	initPopUp() {
		this.popup.conteneur.classList.add('open');
		this.popup.size.textContent = this.settings.dimensions[0] + 'x' + this.settings.dimensions[1];
		this.popup.speed.textContent = this.delay + ' ms';
		this.popup.title.textContent = this.settings.title;
		this.popup.play.textContent = 'PLAY';
		this.popup.play.focus();

		this.popup.play.addEventListener('click', () => {
			this.start();
			this.popup.conteneur.classList.remove('open');
		});
	}

	exit(){
		clearInterval(this.interval);
	}

	resize(){
		if(!this.board)
			return
		this.board.updateBoardSize();
		this.board.drawBoard();
		this.board.drawSnake(this.snake, this.direction);
	}

	start() {
		this.loadConfig(this.settings);
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
			default:
				console.log('Error: direction not found');

		}

		if (!this.isInsideBoard(head) || this.isWall(head) || this.isSnake(head,true)) {
			clearInterval(this.interval);
			this.board.drawSnake(this.snake, this.direction);

			this.popup.conteneur.classList.add('open');
			this.popup.title.textContent = "GAME OVER";
			this.popup.play.textContent = 'REPLAY';

			this.popup.play.focus();
	
			return;
		}
		
		if(this.isFood(head)){
			this.generateFood();
			this.updateScore();
		}else{
			let tail = this.snake.pop();
			this.board.drawEmptyCell(tail);
			this.map[tail.y][tail.x] = MapElements.EMPTY;
		}
		
		this.snake.unshift(head);
		this.map[head.y][head.x] = MapElements.SNAKE;
		
		this.board.drawSnake(this.snake, this.direction);
		this.turning = false;
	}

	isInsideBoard(coords) {
		return coords.x >= 0 && coords.x < this.settings.dimensions[0] 
			&& coords.y >= 0 && coords.y < this.settings.dimensions[1];
	}

	isWall(coords) {
		return this.map[coords.y][coords.x] === MapElements.WALL;
	}

	isSnake(coords) {
		return this.map[coords.y][coords.x] === MapElements.SNAKE;
	}

	isFood(coords) {
		return this.map[coords.y][coords.x] === MapElements.FOOD;
	}

	generateFood() {
		let coords;

		do {
			coords = new Coordinate(Math.floor(Math.random() * this.board.cellNumber), Math.floor(Math.random() * this.board.cellNumber));
		} while (this.isWall(coords) || this.isSnake(coords) || this.isFood(coords));

		this.map[coords.y][coords.x] = MapElements.FOOD;
		this.board.drawFood(coords);
	}

	updateScore() {
		this.popup.score.textContent = this.snake.length;
	}

}