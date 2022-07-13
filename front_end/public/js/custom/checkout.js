import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";

import { calculate_total, get_cart } from "./get-cart.js";
import { address_func } from "./auth.js";

const checkout_function = async (event) => {
	// ? check how to use radio buttons
	event.preventDefault();
	let values = get_form_data("registration_form");
	// if its it cash on delivery push the cart data to the orders
	// if its mpesa/paypal come up with a payment page for both Mpesa and paypal
};

async function checkout_main_func() {
	let cart = await get_cart();
	console.log("cart");
	console.log(cart);
	calculate_total(cart);
	await address_func();
	let checkout_btn = document.getElementById("checkout_form");

	if (checkout_btn) {
		checkout_btn.addEventListener("submit", checkout_function);
		// address_func();
	}
}

export { checkout_main_func };
