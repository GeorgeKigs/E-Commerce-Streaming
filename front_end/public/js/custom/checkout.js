import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";

import { get_cart } from "./get-cart.js";

const checkout_function = async (event) => {
	// ? check how to use radio buttons
	event.preventDefault();
	let values = get_form_data("registration_form");
	// if its it cash on delivery push the cart data to the orders
	// if its mpesa/paypal come up with a payment page for both Mpesa and paypal
};

let checkout_btn = document.getElementById("checkout_form");

if (checkout_btn) {
	checkout_btn.addEventListener("submit", checkout_function);
	setAddress();
}

export { checkout_function };
