import {SnakeConfiguration} from "./modules/SnakeConfiguration.js";
import {Board} from "./modules/Board.js";
import {SnakeGame} from "./modules/SnakeGame.js";

// -------------------------------
//			Variables
// -------------------------------

let configuration = await SnakeConfiguration.loadConfiguration("medium");

let board = document.querySelector('#board');
let binds = [
	{
		'direction': 'Top',
		'deadDirection': 'Bottom',
		'keys': ['ArrowUp', 'z']
	},
	{
		'direction': 'Bottom',
		'deadDirection': 'Top',
		'keys': ['ArrowDown', 's']
	},
	{
		'direction': 'Left',
		'deadDirection': 'Right',
		'keys': ['ArrowLeft', 'q']
	},
	{
		'direction': 'Right',
		'deadDirection': 'Left',
		'keys': ['ArrowRight', 'd']
	}
]

let popUpPlay = {
	popUp: document.querySelector('.popup-play'),
	title: document.querySelector('.title'),
	play: document.querySelector('.play'),
	size: document.querySelector('.size'),
	speed: document.querySelector('.speed'),
}

// -------------------------------
//			Main script
// -------------------------------

let boardSize = Math.min(window.innerHeight/2, window.innerWidth*0.9);

board.width = boardSize;
board.height = boardSize;

let drawer = new Board(board.getContext('2d'), boardSize, Math.round(boardSize / configuration.dimensions));

drawer.initBoard(500);

let game = new SnakeGame(configuration.snake, configuration.walls, configuration.foods, configuration.delay, 'Right', binds, drawer);

popUpPlay.size.textContent = configuration.dimensions + 'x' + configuration.dimensions;
popUpPlay.speed.textContent = configuration.delay + ' ms';
popUpPlay.title.textContent = configuration.title;

popUpPlay.play.addEventListener('click', () => {
	setTimeout(() => {
		game.start();
	}, 400);
	popUpPlay.popUp.classList.remove('open');
});

window.addEventListener("keydown", (event) => game.keyPressed(event));
