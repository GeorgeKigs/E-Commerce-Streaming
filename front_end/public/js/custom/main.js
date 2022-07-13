import { login_func, logout_func, registration_func } from "./auth.js";
import { checkout_main_func } from "./checkout.js";
import { get_cart, cart_page_func } from "./get-cart.js";
import { get_categories } from "./index_page.js";
import { getProducts, search } from "./shop-prods.js";
import { single_product_page } from "./single-product.js";

/**
 * Sets the navigation links of the files.
 * @param {string} heading Page within the header files
 */
async function headers(heading) {
	// set the active link
	console.log(heading);
	const link = document.getElementById(`${heading}_li`);
	link.setAttribute("class", "active");

	// set the number of goods in the cart
	let cart = await get_cart();
	let len = cart.length;
	const cart_nav = document.getElementsByClassName("cart-nav").item(0);
	let span = cart_nav.getElementsByTagName("span").item(0);
	span.innerText = `(${len})`;

	// set the function for wish_list

	// listener to the search form
	document.getElementById("search-form").addEventListener("submit", search);
}

/**
 * Acts as the orchestrator
 */
function main() {
	var link = window.location.href;
	if (link.includes("?")) {
		link = link.split("?")[0];
	}
	var page = link.split("/")[3];
	if (page == "home" || !page) page = "index";
	try {
		// headers(page);
		let PAGES = {
			index: get_categories,
			"product-details": single_product_page,
			shop: getProducts,
			cart: cart_page_func,
			login: login_func,
			registration: registration_func,
			checkout: checkout_main_func,
		};
		let func = PAGES[page];
		func();
	} catch {
		console.log("Page is not defined in the pages used");
	}
}
main();
