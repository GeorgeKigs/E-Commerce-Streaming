import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";

async function update_cart() {
	// synchronize the application with the backend
}

async function get_cart() {
	let cart = localStorage.getItem("cart") || "[]";
	let local_cart = JSON.parse(cart);

	if (!local_cart) {
		let token = get_user_token(); // defined in the main db
		token = null;
		if (token) {
			db_cart = await get_data("/orders/cart");
			local_cart = db_cart.products;
			localStorage.setItem("cart", JSON.stringify(local_cart));
		}
	}
	return local_cart;
}

async function push_cart(products) {
	let cart = await get_cart();
	cart.push(new_prod);
	const data = await send_data("/orders/addCart", products);
	if (data.success) {
		alert("Added to the cart");
	} else {
		alert("Cannot add the cart");
	}
}

async function change_qty(event) {}

async function add_to_cart(event) {
	event.preventDefault();
	let id = event.target.id;

	var new_prod = {
		product: id,
		quantity: 1,
	};
	push_cart(new_prod);
}

async function add_to_cart_single(event) {
	event.preventDefault();
	let id = event.target.id;
	var qty = document.getElementById("qty").value;
	var new_prod = {
		product: id,
		quantity: qty,
	};
	push_cart(new_prod);
}
function delete_to_cart(event) {}

function qty_minus(event) {
	// <span class="qty-minus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty ) &amp;&amp; qty &gt; 1 ) effect.value--;return false;"><i class="fa fa-minus" aria-hidden="true"></i></span>
	// <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" value="1">
	// <span class="qty-plus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i class="fa fa-plus" aria-hidden="true"></i></span>
}

function qty_plus(event) {
	// <span class="qty-minus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty ) &amp;&amp; qty &gt; 1 ) effect.value--;return false;"><i class="fa fa-minus" aria-hidden="true"></i></span>
	// <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" value="1">
	// <span class="qty-plus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i class="fa fa-plus" aria-hidden="true"></i></span>
}

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
