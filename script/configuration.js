import {SnakeConfiguration} from "./model.js";

export function loadConfiguration(mode) {

	return fetch("http://depot.lukamaret.com/snake/" + mode + ".json")
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then((configuration) => SnakeConfiguration.from(configuration))
		.catch((error) => console.log("There was a fetch problem: ", error.message));
}
