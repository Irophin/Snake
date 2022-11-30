import {Coordinate} from "../utils/Coordinate.js";

/**
 * Represents the settings of the snake game.
 */
export class SnakeSettings {

	// title;
	// dimensions;
	// direction;
	// delay;
	// walls;
	// foods;
	// snake;

	constructor(title, dimensions, direction, delay, walls, foods, snake) {
		this.title = title;
		this.dimensions = dimensions;
		this.direction = direction;
		this.delay = delay;
		this.walls = walls;
		this.foods = foods;
		this.snake = snake;
	}

	/**
	 * Loads the settings from a JSON object.
	 *
	 * @param json the JSON object
	 * @returns {SnakeSettings} the settings
	 */
	static from(json) {

		return new SnakeSettings(
			json.title,
			json.dimensions,
			json.direction,
			json.delay,
			json.walls.map((position) => new Coordinate(position[0], position[1])),
			json.foods.map((position) => new Coordinate(position[0], position[1])),
			json.snake.map((position) => new Coordinate(position[0], position[1]))
		);
	}

	/**
	 * Fetches the settings from the server with given level.
	 *
	 * @param level the level number
	 * @returns {Promise<SnakeSettings | void>} the settings
	 */
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