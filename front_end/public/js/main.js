// export { get_form_data, send_data, get_user_token };
/* 
? remember to make a uuid for every customer and store it in the local
? storage for future reference within the database.
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

const get_user_token = () => {
	var token = sessionStorage.getItem("Authorization");
	if (!token) {
		var token = localStorage.getItem("Authorization");
	}
	return token;
};

const get_form_data = (input_id) => {
	let input_data = {};
	let form = document.getElementById(input_id);
	let input = form.getElementsByTagName("input");
	Array.from(input).forEach((item) => {
		input_data[item.id] = item.value;
	});
	return input_data;
};

const send_data = async (url, data) => {
	try {
		var headers = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};
		var token = get_user_token();
		if (token) {
			headers["Authorization"] = token;
		}
		var registration = await fetch(url, {
			method: "post",
			body: JSON.stringify(data),
			headers,
		});
		const json = await registration.json();
		return json;
	} catch (error) {
		console.error(error);
	}
};

const logout_function = async (event) => {
	event.preventDefault();
	var data = await send_data("/users/logout", {});
	if (data["success"] == true) {
		localStorage.removeItem("Authorization");
		sessionStorage.removeItem("Authorization");
	} else {
		handleErrors(data["message"]);
	}
};

const checkout_function = async (event) => {
	// ? check how to use radio buttons
	event.preventDefault();
	// if its it cash on delivery push the cart data to the orders
	// if its mpesa/paypal come up with a payment page for both Mpesa and paypal
};

const sign_up_function = async (event) => {
	event.preventDefault();

	let values = get_form_data("registration_form");

	let reg_data = {
		first_name: values["first_name"],
		last_name: values["last_name"],
		email: values["email"],
		phoneNumber: values["phone_number"],
	};

	var new_account = values["customCheck2"];
	var change_addr = values["customCheck3"];

	let addr_data = {
		email: values.email,
		street: values["street_address"],
		city: values.city,
		zipcode: values.zipCode,
	};
	try {
		// send the registration data to the db
		if (new_account) {
			reg_data["uuid"] = gen_uuid();

			await registration(reg_data);
			await user_address(addr_data);
		} else if (change_addr) {
			await user_address(addr_data);
		}
	} catch (error) {
		console.error(error);
	}
};

const registration = async (data) => {
	var registration = await send_data("/users/registration", reg_data);
	if (registration["success"] == true) {
		localStorage.setItem("phoneNumber", data["phoneNumber"]);
		localStorage.setItem("uuid", registration["uuid"]);
		localStorage.setItem("authorzation", registration["token"]);
		sessionStorage.setItem("Authorization", registration["token"]);
	} else {
		handleErrors(registration["message"]);
	}
};

const login_function = async (event) => {
	event.preventDefault();

	// get the ip address of the user.
	console.log("here");
	let values = get_form_data("login_form");
	console.log(values);
	let rem = document.getElementById("rem_check").checked;

	console.log(rem);
	delete values["rem_check"];

	try {
		const json = await send_data("http://localhost:5000/users/login", values);
		console.log(json);
		if (json["success"] == true) {
			if (rem) {
				localStorage.setItem("Authorization", json["token"]);
			}
			sessionStorage.setItem("Authorization", json["token"]);
			localStorage.setItem("uuid", json["uuid"]);
		} else {
			handleErrors(json["message"]);
		}
	} catch (error) {
		console.log(error);
	}
};

const user_address = async (data) => {
	var addr_dets = await send_data("/users/address/new", addr_data);
};

const handleErrors = (message) => {
	console.log(data);
};

window.onload = () => {
	console.log("here");
	gen_uuid();
};

let login_submit_btn = document.getElementById("login_form");
let registration_btn = document.getElementById("registration_btn");
let checkout_btn = document.getElementById("checkout_btn");

if (login_submit_btn) {
	login_submit_btn.addEventListener("submit", login_function);
}

if (registration_btn) {
	registration_btn.addEventListener("click", sign_up_function);
	checkout_btn.addEventListener("submit", checkout_function);
}
