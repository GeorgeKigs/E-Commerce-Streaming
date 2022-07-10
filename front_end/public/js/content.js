import { get_user_token, get_form_data, get_data } from "./main.js";

var page = window.location.href.split("/")[3];
// if (page.includes("?")) {
// 	page = page.split("?")[0];
// } else {
// 	alert("page Not found");
// 	window.location.href = "home";
// }

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

async function headers(heading) {
	// set the active link
	console.log(heading);

	const link = document.getElementById(`${heading}_li`);
	link.setAttribute("class", "active");

	// set the number of goods in the cart
	let cart = await get_cart();
	let len = cart.products.length;
	const cart_nav = document.getElementsByClassName("cart-nav").item(0);
	let span = cart_nav.getElementsByTagName("span").item(0);
	span.innerText = `(${len})`;

	// set the function for wish_list
}

async function getCategories() {
	let price = parseInt(Math.random() * 1000);

	const fetch_data = await (
		await fetch("http://localhost:5000/products/categories")
	).json();

	console.log(fetch_data);

	let data = fetch_data.data;
	console.log("index");

	let main_div = document.getElementsByClassName("amado-pro-catagory").item(0);
	// document.createDocumentFragment();
	for (let div = 0; div < data.length; div++) {
		let new_html = document.createElement("div");
		new_html.setAttribute("class", "single-products-catagory clearfix");
		// main_div.appendChild(new_html);

		let link = document.createElement("a");
		link.setAttribute("id", `${data[div]._id}`);
		link.setAttribute("class", "cart_link");
		new_html.appendChild(link);

		let cat_img = document.createElement("img");
		cat_img.setAttribute(
			"src",
			`img/bg-img/${data[div].categoryPics[0].location}`
		);
		let hov_cont = document.createElement("div");
		hov_cont.setAttribute("class", "hover-content");

		let line = document.createElement("div");
		line.setAttribute("class", "line");
		link.appendChild(cat_img);
		link.appendChild(hov_cont);
		hov_cont.appendChild(line);

		let pr = document.createElement("p");
		pr.setAttribute("class", "price");
		pr.innerText = `From Ksh: ${price}`;
		hov_cont.appendChild(pr);

		let h4 = document.createElement("h4");
		h4.setAttribute("class", "prod_name");
		h4.innerText = data[div].categoryName;
		// hov_cont.appendChild(h4);
	}
}

async function set_products_page() {
	const products = await get_data("/products/filterProducts");
	console.log(products);
	// pagination: set the page in the get request to get
	//the next round of images
	// product:
	// rating & cart
	// get the  main class

	let main_class = document.getElementsByClassName("products-page").item(0);

	let place_holder = "place_holder";
	products.data.forEach((product) => {
		let html = `<div class="col-12 col-sm-6 col-md-12 col-xl-6">
		<div class="single-product-wrapper">
			<!-- Product Image -->
			<div class="product-img">
				<img src="img/product-img/${product.productPic[0].location}" alt="" />
				<!-- Hover Thumb -->
				<img class="hover-img" src="img/product-img/${product.productPic[1].location}" alt="" />
			</div>

			<!-- Product Description -->
			<div
				class="product-description d-flex align-items-center justify-content-between"
			>
				<!-- Product Meta Data -->
				<div class="product-meta-data">
					<div class="line"></div>
					<p class="product-price">Ksh: ${product.price}</p>
					<a href="product-details.html">
						<h6>${product.productName}</h6>
					</a>
				</div>
				<!-- Ratings & Cart -->
				<div class="ratings-cart text-right">
					<div class="ratings" id="${product._id}-ratings">
					</div>
					<div class="cart">
						<a
							href="${place_holder}"
							data-toggle="tooltip"
							data-placement="left"
							title="Add to Cart"
							><img src="img/core-img/cart.png" alt=""
						/></a>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
		// ratings
		// let rating_class = document.getElementById(`${product._id}-ratings`);
		// for (let index = 0; index < 5; index++) {
		// 	let rate = document.createElement("i");
		// 	rate.setAttribute("class", "fa fa-star");
		// 	rate.setAttribute("aria-hidden", "true");
		// 	rating_class.appendChild(rate);
		// }
		let product_div = document.createElement("div");
		product_div.innerHTML = html;
		main_class.appendChild(product_div);
	});
}
function shop_slider_func() {
	const prices = [0, 1000];
	let slider = document.getElementsByClassName("ui-slider").item(0);
	let range = document.getElementsByClassName("range-price").item(0);
	range.innerText = `Ksh:${prices[0]} - Ksh:${prices[1]}`;

	// minimum price
	slider.setAttribute("data-min", prices[0]);
	// maximum price
	slider.setAttribute("data-max", prices[1]);
}

function shop_tags_func() {}

async function shop_category_func(main) {
	const category_data = (await get_data("/products/categories")).data;
	let category_class = document
		.getElementsByClassName("catagories-menu")
		.item(0);

	let list = category_class.getElementsByTagName("ul").item(0);
	category_data.slice(null, 5).forEach((element) => {
		let category = document.createElement("li");
		let link = document.createElement("a");
		link.href = "#";
		link.innerText = element.categoryName;
		category.appendChild(link);
		list.appendChild(category);
		if (main && category_data[0].categoryName == element.categoryName) {
			category.setAttribute("class", "active");
		}
	});
}

function search() {
	// set the main category to active
	// set the prices of the products on the slider
	// paginate
}

async function getProducts() {
	await shop_category_func(false);
	// slider
	shop_slider_func();
	// tags
	shop_tags_func();

	// products
	await set_products_page();
}

async function getSingleProduct() {
	const query = window.location.href.split("?")[1];
	let params = query.split("=");
	if (params[0] !== "productID") {
		alert("Product has not been found");
		window.location.href = "shop";
	}

	console.log(params);

	const results = await get_data(`/products/productId/${params[1]}`);
	console.log(results);

	if (results.data) {
		let data = results.data;

		//set the name of the product
		let product_name = Array.from(
			document.getElementsByClassName("product-name")
		);
		product_name.forEach((element) => {
			element.innerHTML = data.productName;
		});

		// set the price of the product
		document.getElementById("price").innerText = data.price;

		// set the quantity
		document.getElementById("qty").setAttribute("max", data.quantity);
		if (data.quantity < 1) {
			let quan = document.getElementById("available");
			quan.getElementsByTagName("span").item(0).innerText = "Not Available";
			quan.setAttribute("class", "");
			document.getElementById("add_cart").removeAttribute("disabled");
		}
		// set the description
		document.getElementById("description").innerHTML = data.description;

		// set the category
		let category = document.getElementById("category");
		category.innerText = data.category.categoryName;

		// set the images of the product
		let pics = document.getElementsByClassName("carousel-indicators").item(0);
		let parents = document.getElementsByClassName("carousel-inner").item(0);
		for (let index = 0; index < data.productPic.length; index++) {
			const element = data.productPic[index];

			// select the image - classes required
			let list = document.createElement("li");
			let big_pic = document.createElement("div");

			// set the carousel-indicator attributes
			list.setAttribute("data-target", "#product_details_slider");
			list.setAttribute("data-slide-to", `${index}`);
			list.setAttribute(
				"style",
				`background-image: url(img/product-img/${element.location})`
			);

			// set the carousel inner attributes
			big_pic.setAttribute("class", "carousel-item");
			let link = document.createElement("a");
			link.setAttribute("class", "gallery_img");
			link.href = `img/product-img/${element.location}`;

			let img = document.createElement("img");
			img.setAttribute("src", `img/product-img/${element.location}`);
			img.setAttribute("class", "d-block w-100");

			if (index == 0) {
				// add the active classes
				list.className = "active";
				big_pic.setAttribute("class", "carousel-item active");
			}

			// appending the elements
			link.appendChild(img);
			big_pic.appendChild(link);

			pics.appendChild(list);
			parents.appendChild(big_pic);
		}
		// search operation for the category
		category.setAttribute("href", "1445");

		// add to cart functionality
	} else {
		alert("Product has not been found");
		window.location.href = "shop";
	}
}
async function getCart() {
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

headers(page);
try {
	let PAGES = {
		index: getCategories,
		"product-details": getSingleProduct,
		shop: getProducts,
		cart: getCart,
	};
	PAGES[page]();
} catch {
	console.log("Page is not defined in the pages used");
}
