const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "1U1lW4tM2FI4QuF2ycFk2aEwzftdDvU2tx1kOWnAHeC4gssGeeCHs4j0I1V6x-7rh-w6DaWoNSrW0fWcs58yUqd92b1zO0otTcqq0Z3rvHlQGe7zX14BCjdffbjmtcX2TtSR3GZYP_cHOxqjc0E9OSA3KJ7kMGnmlUCYksnBFCfE_hjnlGW6txMgzUCwRO1XIp560LlKcC7b-4CK1yyM90g";
const _U = "1U1lW4tM2FI4QuF2ycFk2aEwzftdDvU2tx1kOWnAHeC4gssGeeCHs4j0I1V6x-7rh-w6DaWoNSrW0fWcs58yUqd92b1zO0otTcqq0Z3rvHlQGe7zX14BCjdffbjmtcX2TtSR3GZYP_cHOxqjc0E9OSA3KJ7kMGnmlUCYksnBFCfE_hjnlGW6txMgzUCwRO1XIp560LlKcC7b-4CK1yyM90g";
module.exports.config = {
	name: "dalle3",
	version: "1.0",
	role: 0,
	credits: "cliff",//api by Samir
	hasPrefix: true,
	description: "dalle3",
	usages: "{prefix}dalle <search query> -<number of images>",
	cooldown: 0,
	aliases: ["dalle"],
};

module. exports. run = async function ({ api, event, args }) {
	const keySearch = args.join(" ");
	const indexOfHyphen = keySearch.indexOf('-');
	const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
	const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

	try {
		const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
		const data = res.data.results.images;

		if (!data || data.length === 0) {
			api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
			return;
		}

		const imgData = [];
		for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
			const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
			const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
			await fs.outputFile(imgPath, imgResponse.data);
			imgData.push(fs.createReadStream(imgPath));
		}

		await api.sendMessage({
			attachment: imgData,
			body: `Here's your generated image`
		}, event.threadID, event.messageID);

	} catch (error) {
		console.error(error);
		api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
	} finally {
		await fs.remove(path.join(__dirname, 'cache'));
	}
}
