/* 
? remember to make a uuid for every customer and store it in the local
? storage for future reference within the database.
*/

let login_submit_btn = document.getElementById("login_sub_btn");
let registration_btn = document.getElementById("registration_btn");
let checkout_btn = document.getElementById("checkout_btn");
// add an event listeners

login_submit_btn.addEventListener("submit", login_function);
registration_btn.addEventListener("submit", sign_up_function);
checkout_btn.addEventListener("submit", chechout_function);

const login_function = async (event) => {
	event.preventDefault();

	// get the ip address of the user.

	let values = get_form_data("login_form");
	console.log(values);
	let rem = values["rem_check"];
	values.delete("rem_check");

	try {
		const json = await send_data("/users/login", values);
		if (rem) {
			localStorage.setItem("authorization", json["token"]);
		}
		sessionStorage.setItem("authorization", json["token"]);
	} catch (error) {
		console.log(error);
	}
};

const chechout_function = async (event) => {
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
	var registration = await send_data("/users/auth/registration", reg_data);
	/* store various data points such as:
	 * phone_number for mpesa
	 * registration status
	 */
	var storedData = JSON.stringify({
		phoneNumber: data["phoneNumber"],
		authorization: "",
		status: "",
	});
	localStorage.setItem("userData", storedData);
};

const user_address = async (data) => {
	var addr_dets = await send_data("/users/address/new", addr_data);
};

const send_data = async (url, data) => {
	try {
		var token = get_user_token();
		var registration = await fetch(url, {
			method: "post",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				authorization: token,
			},
		});
		const json = await registration.json();

		// return data that is successfull
		return json;

		// handle errors sent from the server
	} catch (error) {
		console.error(error);
	}
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

const get_user_token = () => {
	var token = sessionStorage.getItem("authorization");
	if (!token) {
		var token = localStorage.getItem("authorization");
	}
	return token;
};
export { get_form_data, send_data, get_user_token };
