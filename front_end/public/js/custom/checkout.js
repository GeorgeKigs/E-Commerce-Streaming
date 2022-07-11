import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";
async function get_cart() {
	let cart = {
		products: [],
	}; //JSON.parse(localStorage.getItem("cart") || {})
	let local_cart = null;
	if (!local_cart) {
		let token = get_user_token(); // defined in the main db
		token = null;
		if (token) {
			local_cart = await get_data("/orders/cart");
			localStorage.setItem("cart", JSON.stringify(local_cart));
		} else {
			local_cart = cart;
		}
	}

	return local_cart;
}

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

export { get_cart, checkout_function };
