import {SnakeGame} from "./modules/SnakeGame.js";
import {SnakeSettings} from "./modules/SnakeSettings.js";

/**
 * Facade for the game.
 */
export class Snake {

	// game;
	// container;
	// levels;
	// popUp;

	constructor() {
		this.container = document.querySelector("main");
		this.game = new SnakeGame([
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
		]);
	}

	/**
	 * Open the menu with level choice
	 */
	async openMenu() {

		let nav = document.querySelector("nav");

		if (nav) {
			nav.classList.add("close");

			await new Promise((resolve) => {
				setTimeout(() => {
					nav.remove();
					resolve();
				}, 1000);
			});
		}

		let homeTemplate = document.getElementById("home-template");

		this.homeTemplate = homeTemplate.content.cloneNode(true);
		this.container.replaceChildren(this.homeTemplate);

		let levelsConteneur = document.getElementById("levels");
		let HtmlLevels = this.levels.map(level => this.createHTMLLevel(level));
		levelsConteneur.replaceChildren(...HtmlLevels);
	}

	/**
	 * Open the menu with the chosen level
	 *
	 * @param url {string} - The level to load
	 * @returns {Promise<boolean>}  - True if the level is loaded
	 */
	async openGame(url) {

		let gameTemplate = document.getElementById("game-template");
		this.gameTemplate = gameTemplate.content.cloneNode(true);

		this.popUp = {
			conteneur: this.gameTemplate.querySelector('.popup-play'),
			title: this.gameTemplate.querySelector('.title'),
			play: this.gameTemplate.querySelector('.play'),
			size: this.gameTemplate.querySelector('.size'),
			speed: this.gameTemplate.querySelector('.speed'),
			score: this.gameTemplate.querySelector('.score-value'),
		};

		let canvas = this.gameTemplate.querySelector('#board');
		let found = await this.loadLevel(url);

		if (found) {
			this.container.replaceChildren(this.gameTemplate);
			await this.game.initGame(canvas, this.popUp);

			window.addEventListener("keydown", (event) => this.game.keyPressed(event));
			window.addEventListener("resize", () => this.game.resize());

			document.querySelector(".mainMenu").addEventListener("click", () => this.game.exit());
			return true;
		}

		return false;
	}

	/**
	 * Load the level from the url
	 *
	 * @param url {string} - The level to load
	 * @returns {Promise<boolean>} - True if the level is loaded
	 */
	async loadLevel(url) {

		let level = this.levels.find((level) => level.href === url);

		if (level) {
			let settings = await SnakeSettings.loadSettings(level.json);
			this.game.setSettings(settings, level.json.split('.')[0]);
			return true;
		}

		return false;
	}

	/**
	 * Stop the game
	 */
	exitGame() {
		this.game.exit();
	}

	/**
	 * Update the level list from the json file
	 */
	async updatesLevels() {
		return fetch("levels/level-list.json")
			.then((response) => response.json())
			.then((json) => this.levels = json.levels);
	}

	/**
	 * Create the HTML link for a level
	 *
	 * @param json {$ObjMap} - The json of the level
	 * @returns {HTMLAnchorElement} - The HTML link
	 */
	createHTMLLevel(json) {
		let element = document.createElement("li");
		element.textContent = json.title;

		let link = document.createElement("a");
		link.href = json.href;
		link.appendChild(element);

		return link;
	}
	
}
