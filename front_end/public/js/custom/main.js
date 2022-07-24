import { login_func, logout_func, registration_func } from "./auth.js";
import { checkout_main_func } from "./checkout.js";
import { get_cart, cart_page_func } from "./get-cart.js";
import { get_categories } from "./index_page.js";
import { getProducts, search } from "./shop-prods.js";
import { single_product_page } from "./single-product.js";
import { check_uuid } from "./utils.js";

/**
 * Sets the navigation links of the files.
 * @param {string} heading Page within the header files
 */
async function headers(heading) {
	// set the active link
	console.log(heading);
	try {
		const link = document.getElementById(`${heading}_li`);
		link.setAttribute("class", "active");
	} catch (error) {
		console.log("Path is not in the headers");
	}

	// set the number of goods in the cart
	let cart = await get_cart();
	let len = cart.length;
	const cart_nav = document.getElementsByClassName("cart-nav").item(0);
	let span = cart_nav.getElementsByTagName("span").item(0);
	span.innerText = `(${len})`;

	// function to logout
	let token = sessionStorage.getItem("authorization");
	if (token) {
		let login_nav = document.getElementsByClassName("login-nav").item(0);
		login_nav.innerHTML = `<i class="fa fa-user"></i> Logout`;
		login_nav.setAttribute("id", "logout");
		login_nav.addEventListener("click", logout_func);
		login_nav.setAttribute("href", "logout");
	} else {
		let login_nav = document.getElementsByClassName("login-nav").item(0);
		login_nav.innerHTML = `<i class="fa fa-user"></i> Login`;
		login_nav.setAttribute("id", "login");
		login_nav.setAttribute("href", "login");
	}
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
		headers(page);
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
