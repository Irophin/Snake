import {SnakeGame} from "./modules/SnakeGame.js";
import {SnakeSettings} from "./modules/SnakeSettings.js";

export class Snake {

	// game;
	// container;
	// levels;
	//
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

	async openMenu(){

		let nav = document.querySelector("nav");

		if (nav){
			nav.classList.add("close");

			let promise = new Promise((resolve,) => {
				setTimeout(() => {
					nav.remove();
					resolve();
				}, 1000);
			});
			await promise;
		}

		let homeTemplate = document.getElementById("home-template");

		this.homeTemplate = homeTemplate.content.cloneNode(true);
		this.container.replaceChildren(this.homeTemplate);

		let levelsConteneur = document.getElementById("levels");
		let HtmlLevels = this.levels.map(level => this.createHTMLLevel(level));
		levelsConteneur.replaceChildren(...HtmlLevels);
	}

	async openGame(href){

		let gameTemplate = document.getElementById("game-template");
		this.gameTemplate = gameTemplate.content.cloneNode(true);

		let canvas = this.gameTemplate.querySelector('#board');

		this.popUp = {
			conteneur: this.gameTemplate.querySelector('.popup-play'),
			title: this.gameTemplate.querySelector('.title'),
			play: this.gameTemplate.querySelector('.play'),
			size: this.gameTemplate.querySelector('.size'),
			speed: this.gameTemplate.querySelector('.speed'),
			score: this.gameTemplate.querySelector('.score-value'),
		};

		let found = await this.loadGame(href);

		if (found){
			this.container.replaceChildren(this.gameTemplate);
			await this.game.initGame(canvas, this.popUp);

			window.addEventListener("keydown", (event) => this.game.keyPressed(event));
			window.addEventListener("resize", () => this.game.resize());
			
			let mainMenu = document.querySelector(".mainMenu");
			mainMenu.addEventListener("click", () => {
				this.game.exit();
			});

			return true;
		}
		return false;
	}

	async loadGame(href){

		let level = this.levels.find((level) => level.href === href);

		if (!level){
			return false;
		}

		let settings = await SnakeSettings.loadSettings(level.json);
		this.game.setSettings(settings, level.json.split('.')[0]);

		return true;
	}

	exitGame(){
		this.game.exit();
	}

	async updatesLevels() {
		return await fetch("levels/level-list.json")
			.then((response) => response.json())
			.then((json) => this.levels = json.levels);
	}

	createHTMLLevel(json){
		let element = document.createElement("li");
		let link = document.createElement("a");
		element.textContent = json.title;
		link.href = json.href;
	
		link.appendChild(element);
		return link;
	}
	
}
