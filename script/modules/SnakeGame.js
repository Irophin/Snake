import {Coordinate} from "../utils/Coordinate.js";
import {MapElements} from "../utils/MapElements.js";
import {Board} from "./Board.js";

export class SnakeGame {

    settings;

    snake;
    delay;
    initialDelay;
    direction;
    running;
    startTime;
    lastUpdate;

    board;
    map;

    popup;
    binds;
    turning = false;
    lastDirection;

    constructor(binds) {
        this.binds = binds;
    }

    async initGame(canvas, popUp) {
        this.board = new Board(canvas);
        this.popup = popUp;

        this.loadConfig(this.settings);
        this.initPopUp();

        this.board.setMap(this.map);
        await this.board.initBoard(500);
        this.board.drawSnake(this.snake, this.direction, 1);
    }

    setSettings(settings) {
        this.settings = settings
    }

    loadConfig(settings) {

        this.snake = [...settings.snake];
        this.delay = settings.delay;
        this.initialDelay = settings.delay;
        this.running = true;
        this.lastUpdate = Date.now();
        this.startTime = Date.now();
        this.direction = settings.direction;
        this.lastDirection = settings.direction;
        this.map = [];

        for (let i = 0; i < settings.dimensions[0]; i++) {
            this.map.push([]);
            for (let j = 0; j < settings.dimensions[1]; j++) {
                this.map[i].push(MapElements.EMPTY);
            }
        }

        for (const {x, y} of settings.walls) {
            this.map[y][x] = MapElements.WALL;
        }

        for (const {x, y} of settings.foods) {
            this.map[y][x] = MapElements.FOOD;
        }

        for (const {x, y} of settings.snake) {
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

    exit() {
        this.running = false;
    }

    resize() {
        if (!this.board)
            return
        this.board.updateBoardSize();
        this.board.drawBoard();
        this.board.drawSnake(this.snake, this.direction);
    }

    start() {
        this.loadConfig(this.settings);
        this.board.setMap(this.map);
        this.board.drawBoard(this.walls, this.foods);
        this.board.drawSnake(this.snake, this.direction);
        this.updateScore();
        window.requestAnimationFrame(() => this.moveSnake());
    }

    keyPressed(event) {

        if (this.turning) {
            return;
        }
        this.turning = true;

        for (let i = 0; i < this.binds.length; i++) {

            if (this.binds[i].keys.includes(event.key)) {
                if (this.direction != this.binds[i].deadDirection) {
                    this.direction = this.binds[i].direction;
                }
            }
        }
    }

    moveSnake() {

        if (!this.running)
            return;

        let elapse = Date.now() - this.lastUpdate;

        if (elapse < this.delay) {
            window.requestAnimationFrame(() => this.moveSnake());


            if (!this.turning){
                this.lastDirection = this.direction;
                this.board.drawSnake(this.snake, this.direction,elapse/this.delay);
            }
            else{
                this.board.drawSnake(this.snake, this.lastDirection,elapse/this.delay);
            }
 
            return;
        }

        let head = {...this.snake[0]};
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

        if (!this.isInsideBoard(head) || this.isWall(head) || this.isSnake(head)) {
            this.running = false;
            
            this.board.drawSnake(this.snake, this.direction,1);

            this.popup.conteneur.classList.add('open');
            this.popup.title.textContent = "GAME OVER";
            this.popup.play.textContent = 'REPLAY';

            this.popup.play.focus();

            return;
        }

        if (this.isFood(head)) {
            this.generateFood();
            this.updateScore();
        } else {
            let tail = this.snake.pop();
            this.board.drawEmptyCell(tail);
            this.map[tail.y][tail.x] = MapElements.EMPTY;
        }

        this.snake.unshift(head);
        this.map[head.y][head.x] = MapElements.SNAKE;

        this.board.drawSnake(this.snake, this.direction);
        this.turning = false;
        this.lastUpdate = Date.now();
        this.delay = (this.initialDelay - (this.initialDelay / 100)) / (1 + Math.exp(0.03 * ((Date.now() - this.startTime) / 300 - 200))) + (this.initialDelay / 100);
        window.requestAnimationFrame(() => this.moveSnake());
    }

    isInsideBoard(coords) {
        return 0 <= coords.x && coords.x < this.settings.dimensions[1]
            && 0 <= coords.y && coords.y < this.settings.dimensions[0];
    }

    isWall(coords) {
        return this.map[coords.y][coords.x] === MapElements.WALL;
    }

    isSnake(coords) {
        let shadowTail = this.snake.at(-1);
        return this.map[coords.y][coords.x] === MapElements.SNAKE && 
               !(shadowTail.x === coords.x && shadowTail.y === coords.y);
    }

    isFood(coords) {
        let shadowTail = this.snake.at(-1);
        return this.map[coords.y][coords.x] === MapElements.FOOD &&
                !(shadowTail.x === coords.x && shadowTail.y === coords.y);
    }

    generateFood() {

        let emptyCases = [];
        let foods = 0;
        for (let i = 0; i < this.settings.dimensions[0]; i++) {
            for (let j = 0; j < this.settings.dimensions[1]; j++) {
                if (this.map[i][j] === MapElements.EMPTY) {
                    emptyCases.push({x: j, y: i});
                }
                if (this.map[i][j] === MapElements.FOOD) {
                    foods++;
                }
            }
        }

        let coords = emptyCases[Math.floor(Math.random() * emptyCases.length)];
        if (!coords){
            foods--;

            if (foods === 0){
                this.board.drawFood(this.snake.at(-1));
                this.victory = true;

                setTimeout(() => {
                    this.running = false;
                    this.popup.conteneur.classList.add('open');
                    this.popup.title.textContent = "YOU WIN";
                    this.popup.play.textContent = 'REPLAY';
                    this.popup.play.focus();
                },this.delay);

                return;
            }

        }else{
            this.map[coords.y][coords.x] = MapElements.FOOD;
            this.board.drawFood(coords);
        }
    }

    updateScore() {
        this.popup.score.textContent = this.snake.length;
    }

}