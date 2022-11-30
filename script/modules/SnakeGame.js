import {MapElements} from "../utils/MapElements.js";
import {Board} from "./Board.js";

/**
 * Represents a snake game.
 */
export class SnakeGame {

    // settings;
    //
    // snake;
    // delay;
    // initialDelay;
    // direction;
    // running;
    // startTime;
    // lastUpdate;
    // score;
    //
    // board;
    // map;
    // level;
    // walls;
    // foods;
    //
    // popup;
    // binds;
    // turning;
    // lastDirection;

    constructor(binds) {
        this.binds = binds;
        this.turning = false;
    }

    /**
     * Inits the game.
     *
     * @param canvas the canvas to draw on
     * @param popUp the popup to display
     * @returns {Promise<void>} a promise that resolves when the game is ready
     */
    async initGame(canvas, popUp) {
        this.score = 0;
        this.board = new Board(canvas);
        this.popup = popUp;

        this.loadConfig(this.settings);
        this.initPopUp();

        this.board.setMap(this.map);
        await this.board.initBoard();
        this.board.drawSnake(this.snake, this.direction, 1);

        let highScore = localStorage.getItem(this.level + '.bestScore') ?? 0;

        document.querySelector('.level-value').textContent = this.level;
        document.querySelector('.highscore-value').textContent = highScore;
        document.querySelector('.speed-value').textContent = Math.round(this.delay) + ' ms';
    }

    /**
     * Sets the game settings from a JSON file.
     *
     * @param settings the settings to load
     * @param level the level to load
     */
    setSettings(settings, level) {
        this.settings = settings;
        this.level = level;
    }

    /**
     * Loads the game configuration from a JSON file.
     *
     * @param settings the settings to load
     */
    loadConfig(settings) {

        this.snake = [...settings.snake];
        this.delay = settings.delay;
        this.initialDelay = settings.delay;
        this.running = true;
        this.lastUpdate = Date.now();
        this.startTime = Date.now();
        this.direction = settings.direction;
        this.lastDirection = settings.direction;
        this.walls = settings.walls;
        this.foods = settings.foods;
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

    /**
     * Initializes the popup.
     */
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

    /**
     * Starts the game.
     */
    start() {
        this.score = 0;
        this.loadConfig(this.settings);
        this.board.setMap(this.map);
        this.board.drawBoard(this.walls, this.foods);
        this.board.drawSnake(this.snake, this.direction);
        this.updateScore();
        window.requestAnimationFrame(() => this.moveSnake());
    }

    /**
     * Stops the game.
     */
    exit() {
        this.running = false;
    }

    /**
     * Resizes the board.
     */
    resize() {
        if (!this.board) {
            return
        }
        this.board.updateBoardSize();
        this.board.drawBoard();
        this.board.drawSnake(this.snake, this.direction);
    }

    /**
     * Compute the operation to do on key pressed event.
     * @param event the key pressed event
     */
    keyPressed(event) {

        if (this.turning) {
            return;
        }

        this.turning = true;

        for (let i = 0; i < this.binds.length; i++) {

            if (this.binds[i].keys.includes(event.key)) {
                if (this.direction !== this.binds[i].deadDirection) {
                    this.direction = this.binds[i].direction;
                }
            }

        }

    }

    /**
     * Moves the snake and update the game.
     */
    moveSnake() {

        if (!this.running)
            return;

        let elapse = Date.now() - this.lastUpdate;

        if (elapse < this.delay) {
            window.requestAnimationFrame(() => this.moveSnake());


            if (!this.turning){
                this.lastDirection = this.direction;
                this.board.drawSnake(this.snake, this.direction,elapse/this.delay);
            } else{
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
            this.score++;
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

        this.delay = (this.initialDelay - (this.initialDelay / 2)) / (1 + Math.exp(0.03 * ((Date.now() - this.startTime) / 300 - 200))) + (this.initialDelay / 2);

        document.querySelector('.speed-value').textContent = Math.round(this.delay) + ' ms';
        let min = Math.floor((Date.now() - this.startTime) / 60000);
        min = min < 10 ? '0' + min : min;
        let sec = Math.floor((Date.now() - this.startTime) / 1000) % 60;
        sec = sec < 10 ? '0' + sec : sec;
        document.querySelector('.time-value').textContent = min + ':' + sec;

        let bestScore = localStorage.getItem(this.level + '.bestScore');
        if (bestScore == null || bestScore < this.score) {
            localStorage.setItem(this.level + '.bestScore', this.score);
        }
        document.querySelector('.highscore-value').textContent = localStorage.getItem(this.level + '.bestScore');

        window.requestAnimationFrame(() => this.moveSnake());
    }

    /**
     * Checks if the given position is inside the board.
     *
     * @param coords the position to check
     * @returns {boolean} true if the position is inside the board, false otherwise
     */
    isInsideBoard(coords) {
        return 0 <= coords.x && coords.x < this.settings.dimensions[1] &&
            0 <= coords.y && coords.y < this.settings.dimensions[0];
    }

    /**
     * Checks if the given position is a wall.
     *
     * @param coords the position to check
     * @returns {boolean} true if the position is a wall, false otherwise
     */
    isWall(coords) {
        return this.map[coords.y][coords.x] === MapElements.WALL;
    }

    /**
     * Checks if the given position is a part of the snake.
     *
     * @param coords the position to check
     * @returns {boolean} true if the position is a part of the snake, false otherwise
     */
    isSnake(coords) {
        let shadowTail = this.snake.at(-1);
        return this.map[coords.y][coords.x] === MapElements.SNAKE &&
            !(shadowTail.x === coords.x && shadowTail.y === coords.y);
    }

    /**
     * Checks if the given position is food.
     *
     * @param coords the position to check
     * @returns {boolean} true if the position is food, false otherwise
     */
    isFood(coords) {
        let shadowTail = this.snake.at(-1);
        return this.map[coords.y][coords.x] === MapElements.FOOD &&
            !(shadowTail.x === coords.x && shadowTail.y === coords.y);
    }

    /**
     * Generate food on the board.
     */
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

                setTimeout(() => {
                    this.running = false;
                    this.popup.conteneur.classList.add('open');
                    this.popup.title.textContent = "YOU WIN";
                    this.popup.play.textContent = 'REPLAY';
                    this.popup.play.focus();
                }, this.delay);

            }

        } else {
            this.map[coords.y][coords.x] = MapElements.FOOD;
            this.board.drawFood(coords);
        }
    }

    /**
     * Update the score on the board.
     */
    updateScore() {
        this.popup.score.textContent = this.score;
    }

}