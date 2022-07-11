import {
	send_data,
	get_data,
	get_form_data,
	get_user_token,
	gen_uuid,
} from "./utils.js";

async function get_categories() {
	let price = parseInt(Math.random() * 1000);

	const fetch_data = await get_data("/products/categories");

	console.log(fetch_data);

	let data = fetch_data.data;
	// console.log("index");

	let main_divs = Array.from(
		document.getElementsByClassName("single-products-catagory")
	);

	for (let div = 0; div < main_divs.length; div++) {
		let price = parseInt(Math.random() * 1000);
		let category = data[div];
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

// let new_html = document.createElement("div");
// new_html.setAttribute("class", "single-products-catagory");

// let link = document.createElement("a");
// // link.setAttribute("id", `${data[div]._id}`);
// // link.setAttribute("class", "cart_link");
// link.href = "#";

// let cat_img = document.createElement("img");
// cat_img.setAttribute(
// 	"src",
// 	`img/bg-img/${data[div].categoryPics[0].location}`
// );

// let hov_cont = document.createElement("div");
// hov_cont.setAttribute("class", "hover-content");

// let line = document.createElement("div");
// line.setAttribute("class", "line");

// let pr = document.createElement("p");
// // pr.setAttribute("class", "price");
// pr.innerText = `From Ksh: ${price}`;

// let h4 = document.createElement("h4");
// // h4.setAttribute("class", "prod_name");
// h4.innerText = data[div].categoryName;

// hov_cont.appendChild(line);
// hov_cont.appendChild(pr);
// hov_cont.appendChild(h4);

// link.appendChild(cat_img);
// link.appendChild(hov_cont);

// new_html.appendChild(link);
// // main_div.appendChild(new_html);
// console.log(new_html.outerHTML);
