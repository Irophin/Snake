export class SnakePosition {

	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(toAdd) {
		return new SnakePosition(this.x + toAdd[0], this.y + toAdd[1]);
	}

}

export class SnakeConfiguration {

	dimensions;
	delay;
	walls;
	food;
	snake;

	constructor(dimensions, delay, walls, food, snake) {
		this.dimensions = dimensions;
		this.delay = delay;
		this.walls = walls;
		this.food = food;
		this.snake = snake;
	}

	static from(json) {

		return new SnakeConfiguration(
			json.dimensions[0],
			json.delay,
			json.walls.map((position) => new SnakePosition(position[0], position[1])),
			new SnakePosition(json.food[0][0], json.food[0][1]),
			json.snake.map((position) => new SnakePosition(position[0], position[1]))
		);
	}

}
