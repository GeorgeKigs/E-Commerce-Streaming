import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";
async function get_single_product_data(productID) {
	const results = await get_data(`/products/productId/${productID}`);
	console.log(results);

	if (!results.data) {
		console.log("Product has not been found");
		// return the user to 404
		window.location.href = "shop";
		return;
	}
	return results.data;
}

async function set_single_product(data) {
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
		document.getElementById("add_cart").setAttribute("disabled", true);
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
		link.addEventListener("click", function (d) {
			(d.mfpEl = this), b._openClick(d, a, c);
		});

		let img = document.createElement("img");
		img.setAttribute("src", `img/product-img/${element.location}`);
		img.setAttribute("class", "d-block w-100");

		if (index == 0) {
			// add the active classes
			list.setAttribute("class", "active");
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
}

async function single_product_page() {
	const query = window.location.href.split("?")[1];
	if (query && query.includes("=")) {
		let params = query.split("=");
		if (params[0] !== "productID") {
			alert("Product has not been found");
			window.location.href = "shop";
		}
		let data = await get_single_product_data(params[1]);
		console.log(data);
		if (data) {
			set_single_product(data);
		}
	} else {
		console.log("Product has not been defined");
		window.location.href = "home";
	}

	// add to cart functionality
}

export { single_product_page };
