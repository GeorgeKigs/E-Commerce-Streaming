/* 
? remember to make a uuid for every customer and store it in the local
? storage for future reference within the database.
*/
import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";
const registration = async (data) => {
	console.log(data);
	try {
		var registration = await send_data("/users/register", data);
		console.log(registration);
		if (registration["success"] == true) {
			localStorage.setItem("phoneNumber", data["phoneNumber"]);
			localStorage.setItem("uuid", registration["uuid"]);
			// localStorage.setItem("authorization", registration["token"]);
			// sessionStorage.setItem("authorization", registration["token"]);
			window.location.href = "login";
		} else {
			handleErrors(registration["message"]);
		}
	} catch (error) {
		console.log(error);
		alert("Cannot proceed with registration.");
	}
};

async function set_address() {
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

async function logout_event(event) {
	event.preventDefault();
	var data = await send_data("/users/logout", {});
	if (data["success"] == true) {
		localStorage.removeItem("authorization");
		sessionStorage.removeItem("authorization");
	} else {
		handleErrors(data["message"]);
	}
}

async function address_evnt(event) {
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
		set_address();
	} catch (error) {
		alert("We could not send the data.");
	}
}

async function registration_event(event) {
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
}

async function login_event(event) {
	event.preventDefault();

	// get the ip address of the user.
	console.log("here");
	let values = get_form_data("login_form");
	console.log(values);
	let rem = document.getElementById("rem_check").checked;

	console.log(rem);
	delete values["rem_check"];

	try {
		const data = await send_data("/users/login", values);
		console.log(data);
		if (data["success"] == true) {
			if (rem) {
				localStorage.setItem("authorization", data["token"]);
			}
			sessionStorage.setItem("authorization", data["token"]);
			localStorage.setItem("uuid", data["uuid"]);
			window.location.href = "index";
		} else {
			handleErrors(data["message"]);
		}
	} catch (error) {
		console.log(error);
	}
}

function login_func() {
	let login_submit_btn = document.getElementById("login_form");
	if (login_submit_btn) {
		login_submit_btn.addEventListener("submit", login_event);
	}
}

function registration_func() {
	let registration_btn = document.getElementById("registration_form");
	console.log("registration");
	if (registration_btn) {
		registration_btn.addEventListener("submit", registration_event);
	}
}

async function address_func() {
	let address_btn = document.getElementById("address_form");
	if (address_btn) {
		// set the default phone number
		document
			.getElementById("phone_number")
			.setAttribute("value", localStorage.getItem("phoneNumber"));
		await set_address();
		address_btn.addEventListener("submit", address_evnt);
	}
}

/**
 * Logout function for the users
 * @param {Event} event
 */
function logout_func(event) {
	event.preventDefault();
	localStorage.removeItem("authorization");
	sessionStorage.removeItem("authorization");
	window.location.href = "index";
}

export {
	login_func,
	logout_func,
	address_func,
	set_address,
	registration_func,
};
