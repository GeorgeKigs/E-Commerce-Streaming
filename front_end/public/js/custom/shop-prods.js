import { add_to_cart } from "./get-cart.js";
import { get_data, gen_uuid, send_data } from "./utils.js";

async function set_products_page(products) {
	console.log(products);

	let main_class = document.getElementsByClassName("products-page").item(0);

	let place_holder = "place_holder";
	products.forEach((product) => {
		let html = `
	<div class="col-12 col-sm-6 col-md-12 col-xl-6">
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
					<p class="product-price" id="${product._id}-price" value="${product.price}">Ksh: ${product.price}</p>
					<a href="/product-details?productID=${product._id}">
						<h6>${product.productName}</h6>
					</a>
				</div>
				<!-- Ratings & Cart -->
				<div class="ratings-cart text-right">
					<div class="ratings" id="${product._id}-ratings">
					<i class="fa fa-star" aria-hidden="true"></i>
					<i class="fa fa-star" aria-hidden="true"></i>
					<i class="fa fa-star" aria-hidden="true"></i>
					<i class="fa fa-star" aria-hidden="true"></i>
					<i class="fa fa-star" aria-hidden="true"></i>
					</div>
					
					<div class="cart">
						<a
							class="cart-btn-event"
							data-toggle="tooltip"
							data-placement="left"
							title="Add to Cart"
							id="${product._id}-link"
							value="${product._id}"
							><img 
							src="img/core-img/cart.png" 
							id="${product._id}-img" 
							value="${product._id}"
							alt=""
						/></a>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
		let product_div = document.createElement("div");
		product_div.innerHTML = html;
		main_class.appendChild(product_div);
	});
	// add cart events
	let carts = Array.from(document.getElementsByClassName("cart-btn-event"));
	carts.forEach((cart) => {
		cart.addEventListener("click", add_to_cart);
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

function set_metadata(data) {
	let page_links = Array.from(document.getElementsByClassName("page-link"));
	page_links.forEach((element) => {
		element.addEventListener("click", pagination);
	});

	// class is pagination
	// remember to add the active class to the page
	// <li class="page-item"><a class="page-link" href="#">02.</a></li>

	// set the numbers of the products
	// if the number is 0, get the reminder to add

	// <p>Showing 1-8 0f 25</p>

	// high and low prices
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
		link.href = `/shop?categoryId=${element._id}`;
		link.innerText = element.categoryName;
		category.appendChild(link);
		list.appendChild(category);
		if (main && category_data[0].categoryName == element.categoryName) {
			category.setAttribute("class", "active");
		}
	});
}

async function get_products_data(link) {
	console.log(link);
	if (!link.includes("?")) {
		let data = await get_data("/products/filterProducts");
		return data;
	}
	let query = link.split("?");
	let first_name = query[1].split("=")[0];
	if (first_name === "searchTerm") {
		let data = await get_data(`/products/search?${query[1]}`);
		return data;
	} else {
		console.log(query);
		let data = await get_data(`/products/filterProducts?${query[1]}`);
		return data;
	}
}

const pagination = async (event) => {
	event.preventDefault();
	const eve = event.target.innerText;
	let link = window.location.href;
	if (!link.includes("page")) {
		window.location.href = link + `&page=${eve}`;
	} else {
		let new_link = window.location.href.split("&page")[0];
		window.location.href = new_link + `&page=${eve}`;
	}
};

async function getProducts() {
	let link = window.location.href;
	const products = await get_products_data(link);

	// attach the pagination for the links
	set_metadata(products.metadata);

	await shop_category_func(link.includes("?"));
	// slider
	shop_slider_func();
	// tags
	shop_tags_func();
	// products
	set_products_page(products.data);
}

const set_filters = () => {};

function search(event) {
	//*	productName: req.query.name
	// 	? { $regex: `*${req.query.name}*`, $options: "i" }
	// 	: undefined,

	event.preventDefault();
	let input = document.getElementById("search-input").value;
	if (!input) {
		window.location.href = "shop";
	} else {
		window.location.href = `shop?searchTerm=${input}`;
	}
}

export { getProducts, search };
