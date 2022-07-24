import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
	check_uuid,
} from "./utils.js";
// import { send_log_click, send_log_hover, send_log_cart } from "./shop-prods.js";

/**
 * Delete products from the cart
 * @param {string} product
 * @returns {Promise<boolean>} False if there is an error
 */
async function pull_cart(product) {
	// change the details in the cart
	// let cart = JSON.parse(localStorage.getItem("cart"))
	let cart = [];
	for (let i = 0; i < cart.length; i++) {
		const prod = cart[i];
		if (prod.product == product) {
			cart.splice(i, 1);
		}
	}
	console.log(cart);
	localStorage.removeItem("cart");
	localStorage.setItem("cart", JSON.stringify(cart));

	// check the user token to see if they have logged in
	let token = get_user_token();
	if (token) {
		// send the cart to the db
		await send_data("/orders/cart/add", { products: cart });
	}
	return false;
}

/**
 * Gets the cart in both the db and the local storage.
 * @returns {Promise<[{"product":string,"quantity":number,"price":number}]>} The cart within the system
 */
async function get_cart() {
	// check if user is logged in. push products to the cart
	let token = get_user_token();
	if (token) {
		let db_cart = await get_data("/orders/cart");
		console.log(db_cart);

		db_cart.data.products.forEach(async (prod) => {
			// adds products to the localStorage Cart
			await push_cart({ product: prod.product, quantity: prod.quantity });
		});
	}
	// check the cart in the localStorage (updated or not)
	let cart = localStorage.getItem("cart") || "[]";
	let local_cart = JSON.parse(cart);
	return local_cart;
}

/**
 * Used to add products to the cart and sends them to the database
 * @param {{"product":string,"quantity":number,"price":number}} products These are the products we want to return to the user
 * @returns {Promise<boolean>} boolean
 */
async function push_cart(products) {
	let changed = false;
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	console.log("cart: ", cart);
	try {
		// check for duplicates, append if none
		let prods = [];

		for (let i = 0; i < cart.length; i++) {
			prods.push(cart[i]["product"]);
		}
		if (!prods.includes(products.product)) {
			changed = true;
			cart.push(products);
			console.log(cart);
		}
	} catch (error) {
		console.log(error);
		return false;
	}
	//let cart = await get_cart(); wiil not work, user has to be logged in
	// get the cart within the localStorage
	console.log(changed);
	// if the cart has changed, change the storage
	if (changed) {
		// save in the localstorage. i.e remove then add
		localStorage.removeItem("cart");
		localStorage.setItem("cart", JSON.stringify(cart));

		// check the user token to see if they have logged in
		let token = get_user_token();
		if (token) {
			// send the cart to the db
			await send_data("/orders/cart/add", { products: cart });
		}
		// send the product to the tracker
		// send_log_cart({ uuid: check_uuid(), productID: products.product });
	}
	return true;
}

async function change_qty(event) {}

async function add_to_cart(event) {
	event.preventDefault();

	let id = event.target.id;
	let product_id = id.split("-")[0];
	let link = document.getElementById(id);
	let value = link.getAttribute("value");
	let price = parseInt(
		document.getElementById(`${product_id}-price`).getAttribute("value")
	);

	var new_prod = {
		product: value,
		quantity: 1,
		price,
	};
	console.log(value);
	let returned = await push_cart(new_prod);
	if (returned) {
		alert("Product has been added");
	} else {
		alert("Please try again later");
	}
}

/**
 * Add the product and the quantity after clicking an event
 * @param {Event} event click event on the page of single products
 */
async function add_to_cart_single(event) {
	event.preventDefault();
	let id = event.target.id;
	var quantity = parseInt(document.getElementById("qty").value);
	let product = document.getElementById(id).getAttribute("value");
	let price = parseInt(
		document.getElementById("price-span").getAttribute("value")
	);
	var new_prod = {
		product,
		quantity,
		price,
	};
	console.log(new_prod);
	let returned = await push_cart(new_prod);
	if (returned) {
		alert("Product has been added");
	} else {
		alert("Please try again later");
	}
}

/**
 * Delete a product from the cart
 * @param {Event} event Click event
 */
async function delete_to_cart(event) {
	event.preventDefault();
	let ans = await pull_cart();
	if (ans) {
		alert("Product has been deleted");
	} else {
		alert("Please try again deleted");
	}
}

function qty_minus(event) {
	// <span class="qty-minus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty ) &amp;&amp; qty &gt; 1 ) effect.value--;return false;"><i class="fa fa-minus" aria-hidden="true"></i></span>
	// <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" value="1">
}

function qty_plus(event) {
	// <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" value="1">
	// <span class="qty-plus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i class="fa fa-plus" aria-hidden="true"></i></span>
}

/**
 * Manipulates the values on the DOM.
 * @param {[{"price":number,"quantity":number}]} products
 */
function calculate_total(products) {
	// calculate the total price of the products
	let sum = 0;
	let delivery_fee = 0;
	products.forEach((product) => {
		sum += product.price * product.quantity;
	});
	let cart = document.getElementById("cart_price");
	cart.innerHTML = `${sum}.00`;
	document.getElementById("delivery_price").innerHTML = `${delivery_fee}.00`;
	document.getElementById("total_price").innerHTML = `${sum + delivery_fee}.00`;
}

/**
 * DOM manipulation for the cart in the cart page
 * @param {[{"product":string,"price":number,"quantity":number}]} products
 */
async function set_cart(products) {
	let t_body = document.getElementById("cart_table");

	products.forEach(async (product) => {
		let prod = await get_data(`/products/productId/${product.product}`);
		let data = prod.data;
		let html = `
			<td class="cart_product_img">
				<!-- link to the product details -->
				<a href="/product-details?productID=${data._id}">
					<img src="img/product-img/${data.productPic[0].location}" alt="Product">
				</a>
			</td>
			<td class="cart_product_desc">
				<h5>${data.productName}</h5>
			</td>
			<td class="price">
				Ksh: <span>${data.price}</span>
			</td>
			<td class="qty">
				<div class="qty-btn d-flex">
					<p>Qty</p>
					<div class="quantity">
						<span class="qty-minus"
							onclick="var effect = document.getElementById('${data._id}-qty'); var qty = effect.value; if( !isNaN( qty ) && qty > 1 ) effect.value--;return false;"><i
								class="fa fa-minus" aria-hidden="true"></i></span>
						<input type="number" class="qty-text" id="${data._id}-qty" step="1" min="1"
							max="${data.quantity}" name="quantity" value="${product.quantity}">
						<span class="qty-plus"
							onclick="var effect = document.getElementById('${data._id}-qty'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i
								class="fa fa-plus" aria-hidden="true"></i></span>
					</div>
				</div>
			</td>`;
		let tr = document.createElement("tr");

		tr.innerHTML = html;
		t_body.appendChild(tr);
		// add a delete button
	});

	// todo: add onclick variables for the plus and minus
	// let minus_vals = Array.from(tr.getElementsByClassName("qty-minus"));
	// minus_vals.forEach((element) => {
	// 	element.addEventListener("click", qty_minus);
	// });
	// let plus_vals = Array.from(tr.getElementsByClassName("qty-plus"));
	// plus_vals.forEach((element) => {
	// 	element.addEventListener("click", qty_plus);
	// });

	// set the image
}

async function cart_page_func() {
	let products = await get_cart();

	console.log(products);

	calculate_total(products);
	set_cart(products);
}

export {
	cart_page_func,
	calculate_total,
	get_cart,
	add_to_cart,
	add_to_cart_single,
	delete_to_cart,
};
