var page = window.location.href.split("/")[3];

const getCategories = async () => {
	// categoryName:
	// description:
	// categoryPics: [location]

	// const data = await (
	// 	await fetch("http://localhost:5000/products/categories")
	// ).json();
	console.log("index");
	let divs = document.getElementsByClassName("single-products-catagory");
	for (let div = 0; div < divs.length; div++) {
		const element = divs[div];
		let image = element.getElementsByTagName("img")[0];
		let name = element.getElementsByClassName("prod_name")[0];
		let price = element.getElementsByClassName("price")[0];
		price.innerHTML = "price";
		name.innerHTML = "name";
		// image.setAttribute("src", "img/bg-img/1.jpg");
	}
};

const getProducts = async () => {
	// get the metadata

	// get 5 categories being used
	// const category_data = await (
	// 	await fetch("http://localhost:5000/products/categories")
	// ).json();

	let category_class = document
		.getElementsByClassName("catagories-menu")
		.item(0);

	let list = category_class.getElementsByTagName("ul").item(0);
	let prds = [1, 2, 3, 4];
	// initial category
	let category = document.createElement("li");
	let link = document.createElement("a");
	link.href = "#";
	link.innerText = prds[0];
	category.appendChild(link);
	category.setAttribute("class", "active");
	list.appendChild(category);
	// then add the rest
	prds.slice(1).forEach((element) => {
		let category = document.createElement("li");
		let link = document.createElement("a");
		link.href = "#";
		link.innerText = element;
		category.appendChild(link);
		list.appendChild(category);
	});

	// prices
	const prices = [0, 1000];
	let slider = document.getElementsByClassName("ui-slider").item(0);
	let range = document.getElementsByClassName("range-price").item(0);
	range.innerText = `Ksh:${prices[0]} - Ksh:${prices[1]}`;

	// minimum price
	slider.setAttribute("data-min", prices[0]);
	// maximum price
	slider.setAttribute("data-max", prices[1]);

	const tags = "";
};

const set_products_page = async (link) => {
	const products = await (await fetch()).json();

	// sorting:
	// make a get request with the filters in place
	// as well as the sorting parameters

	// number of products: slice the number of products

	// images

	// pagination: set the page in the get request to get
	//the next round of images

	// product:
	// rating & cart
	let place_holder = "place_holder";
	products.forEach((product) => {
		let html = `<div class="col-12 col-sm-6 col-md-12 col-xl-6">
		<div class="single-product-wrapper">
			<!-- Product Image -->
			<div class="product-img">
				<img src="${place_holder}" alt="" />
				<!-- Hover Thumb -->
				<img class="hover-img" src="${place_holder}" alt="" />
			</div>

			<!-- Product Description -->
			<div
				class="product-description d-flex align-items-center justify-content-between"
			>
				<!-- Product Meta Data -->
				<div class="product-meta-data">
					<div class="line"></div>
					<p class="product-price">Ksh: ${place_holder}</p>
					<a href="product-details.html">
						<h6>${place_holder}</h6>
					</a>
				</div>
				<!-- Ratings & Cart -->
				<div class="ratings-cart text-right">
					<div class="ratings" id="${place_holder}">
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
		// let rating_class = document.getElementById("");
		for (let index = 0; index < 5; index++) {
			let rate = document.createElement("i");
			rate.setAttribute("class", "fa fa-star");
			rate.setAttribute("aria-hidden", "true");
			// rating_class.appendChild(rate)
		}
	});
};

const getSingleProduct = async () => {
	//     productNumber:,
	//     productName:
	//     category:
	//     description: ,
	//     discount:,
	//     price: ,
	//     tags: [tagName],
	//     productPic: [location],
	//     quantity:,
	// }

	const product_id = window.location.href.split("/")[4];
	const data = await (
		await fetch(`http://localhost:5000/product/productId/${product_id}`)
	).json();

	//set the name of the product
	let product_name = Array.from(
		document.getElementsByClassName("product-name")
	);
	product_name.forEach((element) => {
		element.innerHTML = "new";
	});
	// set the price of the product
	document.getElementById("price").innerHTML = 554;

	// set the quantity
	document.getElementById("qty").setAttribute("max", 5);
	if (true) {
		let quan = document.getElementById("available");
		quan.getElementsByTagName("span").item(0).innerText = "Not Available";
		quan.setAttribute("class", "");
		document.getElementById("add_cart").removeAttribute("disabled");
	}
	// console.log("single product");

	// set the description
	document.getElementById("description").innerHTML = "new description";

	// set the category
	let category = document.getElementById("category");
	category.innerHTML = "category";
	category.setAttribute("href", "1445");
};
const getCart = async () => {
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
	const cart = await (
		await fetch("http://localhost:5000/orders/cart", {
			headers: { authorization: localStorage.getItem("authorization") },
		})
	).json();
	const products = Array.from(cart.products);
	calculate_total(products);
	let t_body = document.getElementsByTagName("tbody").item(0);

	products.forEach(async (product) => {
		let prod = await (
			await fetch(`http://localhost:5000/product/productId/${product.product}`)
		).json();
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
};

const qty_minus = (event) => {
	// <span class="qty-minus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty ) &amp;&amp; qty &gt; 1 ) effect.value--;return false;"><i class="fa fa-minus" aria-hidden="true"></i></span>
	// <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" value="1">
	// <span class="qty-plus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i class="fa fa-plus" aria-hidden="true"></i></span>
};

const qty_plus = (event) => {
	// <span class="qty-minus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty ) &amp;&amp; qty &gt; 1 ) effect.value--;return false;"><i class="fa fa-minus" aria-hidden="true"></i></span>
	// <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" value="1">
	// <span class="qty-plus" onclick="var effect = document.getElementById('qty'); var qty = effect.value; if( !isNaN( qty )) effect.value++;return false;"><i class="fa fa-plus" aria-hidden="true"></i></span>
};

const calculate_total = (products) => {
	// calculate the total price of the products
	let sum = 0;
	let delivery_fee = 0;
	products.forEach((product) => {
		sum += product.price * product.quantity;
	});
	document.getElementById("cart_price").innerText = sum;
	document.getElementById("delivery_price").innerText = delivery_fee;
	document.getElementById("total_price").innerText = sum + delivery_fee;
};

const PAGES = {
	index: getCategories,
	"product-details": getSingleProduct,
	shop: getProducts,
	cart: getCart,
};

PAGES[page]();
