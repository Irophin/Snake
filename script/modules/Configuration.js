import {SnakeConfiguration} from "./SnakeGame.js";

export async function loadConfiguration(mode) {

	return fetch("levels/" + mode + ".json")
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then((configuration) => SnakeConfiguration.from(configuration))
		.catch((error) => console.log("There was a fetch problem: ", error.message));
}
