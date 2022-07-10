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

const logout_function = async (event) => {
	event.preventDefault();
	var data = await send_data("/users/logout", {});
	if (data["success"] == true) {
		localStorage.removeItem("authorization");
		sessionStorage.removeItem("authorization");
	} else {
		handleErrors(data["message"]);
	}
};

const checkout_function = async (event) => {
	// ? check how to use radio buttons
	event.preventDefault();
	let values = get_form_data("registration_form");
	// if its it cash on delivery push the cart data to the orders
	// if its mpesa/paypal come up with a payment page for both Mpesa and paypal
};

const registration = async (data) => {
	console.log(data);
	try {
		var registration = await send_data("users/register", data);
		if (registration["success"] == true) {
			localStorage.setItem("phoneNumber", data["phoneNumber"]);
			localStorage.setItem("uuid", registration["uuid"]);
			localStorage.setItem("authorization", registration["token"]);
			sessionStorage.setItem("authorization", registration["token"]);
		} else {
			handleErrors(registration["message"]);
		}
	} catch (error) {
		console.log(error);
		alert("Cannot proceed with registration.");
	}
};

async function setAddress() {
	//
	var data = await get_data("/users/address/");
	if (data.data) {
		let addresses = data.data.address;
		// get the t-body

		let t_body = document.getElementById("address_table");
		t_body.innerHTML = null;
		addresses.forEach((element) => {
			let tr = document.createElement("tr");
			tr.innerHTML = `
			<td class="qty">
				<div class="qty-btn d-flex">
					<input type="radio" name="address" value="${element._id}"/>
				</div>
			</td>
			<td class="cart_product_img">
				<p>${element.street}</p>
			</td>
			<td class="cart_product_desc">
				<h5>${element.zipcode}</h5>
			</td>
			<td class="price">
				<span>${element.phoneNumber}</span>
			</td>
		`;
			t_body.appendChild(tr);
		});
	}
}

async function address_func(event) {
	event.preventDefault();

	let values = get_form_data("address_form");
	console.log(values);

	let addr_data = {
		street: values["street_address"],
		city: values.city,
		zipcode: values.zipCode,
		phone_number: values.phone_number,
	};
	// check for the addresses
	let addr = document.getElementById("address_table").hasChildNodes();

	try {
		await send_data("/users/address/addAddress", addr_data);

		setAddress();
	} catch (error) {
		alert("We could not send the data.");
	}
}

const sign_up_function = async (event) => {
	event.preventDefault();

	let values = get_form_data("registration_form");
	// check if passwords are equal
	if (values["password"] !== values["c_password"]) {
		alert("Passwords should be equal to each other.");
		return;
	}
	// check if the user is registered
	let token = get_user_token();
	console.log(token);
	if (token) {
		alert("User should login.");
		return;
	}
	// get the data
	let reg_data = {
		firstName: values["first_name"],
		lastName: values["last_name"],
		email: values["email"],
		phoneNumber: values["phone_number"],
		password: values["password"],
	};

	try {
		// send the registration data to the db
		reg_data["uuid"] = await gen_uuid();

		console.log(reg_data);
		await registration(reg_data);
	} catch (error) {
		console.error(error);
		alert("Cannot register the user");
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
		const json = await send_data("users/login", values);
		console.log(json);
		if (json["success"] == true) {
			if (rem) {
				localStorage.setItem("authorization", json["token"]);
			}
			sessionStorage.setItem("authorization", json["token"]);
			localStorage.setItem("uuid", json["uuid"]);
		} else {
			handleErrors(json["message"]);
		}
	} catch (error) {
		console.log(error);
	}
};

window.onload = () => {
	gen_uuid();
};

let login_submit_btn = document.getElementById("login_form");
let registration_btn = document.getElementById("registration_btn");
let address_btn = document.getElementById("address_form");
let checkout_btn = document.getElementById("checkout_form");

if (login_submit_btn) {
	login_submit_btn.addEventListener("submit", login_function);
}
if (address_btn) {
	// set the default phone number
	document
		.getElementById("phone_number")
		.setAttribute("value", localStorage.getItem("phoneNumber"));

	address_btn.addEventListener("submit", address_func);
}
if (checkout_btn) {
	checkout_btn.addEventListener("submit", checkout_function);
	setAddress();
}
if (registration_btn) {
	registration_btn.addEventListener("click", sign_up_function);
}

export { get_form_data, get_user_token, send_data, get_data };
