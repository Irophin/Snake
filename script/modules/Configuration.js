import {SnakeSettings} from "./SnakeGame.js";

export async function loadSettings(mode) {

	return fetch("levels/" + mode + ".json")
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then((settings) => SnakeSettings.from(settings))
		.catch((error) => console.log("There was a fetch problem: ", error.message));
}
