// async function send_log_click(productID) {
// 	const user = await gen_uuid();
// 	const product = productID;
// 	console.log({ uuid: user, product: productID });
// 	await send_data("/streams_app/logClicks", { uuid: user, product: productID });
// }

// async function send_log_hover(productID) {
// 	const user = await gen_uuid();
// 	const product = productID;
// 	send_data("/streams_app/logHover", { uuid: user, product: productID });
// }

// async function send_log_cart(productID) {
// 	const user = await gen_uuid();
// 	const product = productID;
// 	send_data("/streams_app/logCart", { uuid: user, product: productID });
// }

// export { send_log_cart, send_log_hover, send_log_click };
