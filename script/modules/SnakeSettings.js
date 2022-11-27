import {Coordinate} from "../utils/Coordinate.js";

export class SnakeSettings {

	title;
	dimensions;
	direction;
	delay;
	walls;
	foods;
	snake;

	constructor(title, dimensions, direction, delay, walls, foods, snake) {
		this.title = title;
		this.dimensions = dimensions;
		this.direction = direction;
		this.delay = delay;
		this.walls = walls;
		this.foods = foods;
		this.snake = snake;
	}

	static from(json) {

		return new SnakeSettings(
			json.title,
			json.dimensions,
			json.direction,
			json.delay,
			json.walls.map((position) => new Coordinate(position[0], position[1])),
			json.food.map((position) => new Coordinate(position[0], position[1])),
			json.snake.map((position) => new Coordinate(position[0], position[1]))
		);
	}

	static async loadSettings(level) {
		return fetch("levels/" + level)
			.then(function (response) {
				if (response.ok) {
					return response.json();
				}
				throw new Error(response.statusText);
			})
			.then((settings) => this.from(settings))
			.catch((error) => console.log("There was a fetch problem: ", error.message));
	}

}