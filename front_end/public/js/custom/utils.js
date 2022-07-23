/**
 * Checks if there is a uuid within the localStorage
 * @returns {string} uuid of the user
 */
const check_uuid = () => {
	var id = localStorage.getItem("uuid");
	if (id) {
		return id;
	}
	return false;
};

const gen_uuid = async () => {
	var id = check_uuid();
	console.log(id);
	// localStorage.clear();
	if (!id) {
		var id = await (await fetch("/getUUID")).json();
		localStorage.setItem("uuid", id["uuid"]);
	}
	console.log(id);
	return id;
};

/**
 * This gets the user token used to login
 * @returns token
 */
function get_user_token() {
	var token = sessionStorage.getItem("authorization");
	console.log(token);
	if (!token) {
		var token = localStorage.getItem("authorization");
		console.log(token);
	}
	return token;
}

// todo: check how to incoperate new input functions such as radio buttons
const get_form_data = (input_id) => {
	let input_data = {};
	let form = document.getElementById(input_id);
	let input = form.getElementsByTagName("input");
	Array.from(input).forEach((item) => {
		input_data[item.id] = item.value;
	});
	return input_data;
};
/**
 *Gets data from the microservices
 * @param {string} url The url to make a GET request
 * @returns {null | *}
 */
async function get_data(url) {
	let token = get_user_token();
	let data = null;
	try {
		// handle the errors that may occur
		data = await (
			await fetch(`http://localhost:5000${url}`, {
				headers: { authorization: `Bearer ${token}` },
			})
		).json();
		if (data["success"]) {
			return data;
		} else {
			if (data.message == "Unauthorized") {
				window.location.href = "login";
			} else {
				return data;
			}
		}
		// return the errors to enable the user to use different actions
	} catch (error) {
		console.log(error);
		alert("Try again later");
	}
}

const send_data = async (url, data) => {
	try {
		var headers = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};
		var token = get_user_token();
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
		console.log(headers);
		console.log(data);
		var registration = await fetch(`http://localhost:5000${url}`, {
			method: "post",
			body: JSON.stringify(data),
			headers,
		});
		const json = await registration.json();

		if (json.message == "Unauthorized") {
			window.location.href = "login";
		}
		return json;
	} catch (error) {
		console.error(error);
	}
};

window.onload = () => {
	gen_uuid();
};

export {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
	check_uuid,
};
