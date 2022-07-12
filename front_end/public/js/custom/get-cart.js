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
	let cart = [];
	//JSON.parse(localStorage.getItem("cart") || {})
	let local_cart = JSON.parse(localStorage.getItem("cart"));

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
	// products.forEach((product) => {
	// 	sum += product.price * product.quantity;
	// });
	let cart = document.getElementById("cart_price");
	cart.innerHTML = sum;
	document.getElementById("delivery_price").innerText = delivery_fee;
	document.getElementById("total_price").innerText = sum + delivery_fee;
}

async function set_cart() {
	console.log("cart");
	//     user:
	//     products: [
	//         {
	//             product: Schema.Types.ObjectId,
	//             price:,
	//             available,
	//             quantity,
	//         },
	//     ]
	let cart = get_cart();
	const products = Array.from(cart.products);
	calculate_total(products);
	let t_body = document.getElementsByTagName("tbody").item(0);

	products.forEach(async (product) => {
		// let prod = await (
		// 	await fetch(`/products/productId${product.product}`)
		// ).json();
		let html = `
			<td class="cart_product_img">
				<!-- link to the product details -->
				<!-- <a href="${placeholder}"><img src="${placeholder}" alt="Product"></a>-->
			</td>
			<td class="cart_product_desc">
				<h5>${placeholder}</h5>
			</td>
			<td class="price">
				Ksh: <span>${placeholder}</span>
			</td>
			<td class="qty">
				<div class="qty-btn d-flex">
					<p>Qty</p>
					<div class="quantity">
						<span class="qty-minus"
							onclick="var effect = document.getElementById('${placeholder}'); var qty = effect.value; if( !isNaN( qty ) && qty > 1 ) effect.value--;return false;"><i
								class="fa fa-minus" aria-hidden="true"></i></span>
						<input type="number" class="qty-text" id="${placeholder}" step="1" min="1"
							max="${placeholder}" name="quantity" value="${placeholder}">
						<span class="qty-plus"
							onclick="var effect = document.getElementById('${placeholder}'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i
								class="fa fa-plus" aria-hidden="true"></i></span>
					</div>
				</div>
			</td>`;
		let tr = document.createElement("tr");

		tr.innerHTML = html;
		t_body.appendChild(tr);
	});

	// todo: add onclick variables for the plus and minus
	let minus_vals = Array.from(tr.getElementsByClassName("qty-minus"));
	minus_vals.forEach((element) => {
		element.addEventListener("click", qty_minus);
	});
	let plus_vals = Array.from(tr.getElementsByClassName("qty-plus"));
	plus_vals.forEach((element) => {
		element.addEventListener("click", qty_plus);
	});

	// set the image
}

export { set_cart, get_cart };
