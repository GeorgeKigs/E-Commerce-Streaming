import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";

async function get_categories() {
	let price = parseInt(Math.random() * 1000);
	const uuid = await gen_uuid();
	const fetch_data = await get_data(`/streams_app/predict/${uuid}`);

	console.log(fetch_data);

	let data = fetch_data.data;
	// console.log("index");

	let main_divs = Array.from(
		document.getElementsByClassName("single-products-catagory")
	);

	for (let div = 0; div < main_divs.length; div++) {
		let price = parseInt(Math.random() * 1000);

		let category = data[div];

		// recommendations
		const fetch_data = await get_data(`/products/productId/${productID}`);

		let element = main_divs[div];

		console.log(category.categoryPics[0].location);
		// set the link to the shops
		let link = element.getElementsByTagName("a").item(0);
		link.setAttribute("href", `/shop?categoryId=${category._id}`);
		// set the images for the categories
		let image = element.getElementsByTagName("img").item(0);
		image.setAttribute(
			"src",
			`img/bg-img/${category.categoryPics[0].location}`
		);
		let p = element.getElementsByTagName("p").item(0);
		p.innerText = `From ${price}`;
		let h4 = element.getElementsByTagName("h4").item(0);
		h4.innerText = category.categoryName;
	}
}

export { get_categories };
