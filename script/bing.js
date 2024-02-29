const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "1uZFkHeMYUc8wkjwDtcAobsI_2HKnAr80tEv2rR8X0pe7WVXREVcXLXrhIDebColJRSZ2hPwX1LA-xJRsrlc8fUtG2cPWjJenISpd95r3HpNFe6qkZ4C1p4Moo5yvowl5_5bzl3N4WO5nMraLG98cWiLdEu9OH_uwz075dGYsuk7mSxql0G-C8lgmhIi5MUobqwmWj05jF7mPRH2IjA2M3R8UjoAjiKDaWEMmeeTl6tI";
const _U = "1uZFkHeMYUc8wkjwDtcAobsI_2HKnAr80tEv2rR8X0pe7WVXREVcXLXrhIDebColJRSZ2hPwX1LA-xJRsrlc8fUtG2cPWjJenISpd95r3HpNFe6qkZ4C1p4Moo5yvowl5_5bzl3N4WO5nMraLG98cWiLdEu9OH_uwz075dGYsuk7mSxql0G-C8lgmhIi5MUobqwmWj05jF7mPRH2IjA2M3R8UjoAjiKDaWEMmeeTl6tI";
module.exports.config = {
name: 'bing',
  version: '2.0.0',
  credits: 'Null69', //api by samir
  aliases: ['dalle3'],
  description: '𝗗𝗔𝗟𝗟𝗘 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗆𝖺𝖽𝖾 𝖻𝗒 𝖢𝗅𝗂𝖿𝖿 𝖵𝗂𝗇𝖼𝖾𝗇𝗍 𝖳𝗈𝗋𝗋𝖾𝗏𝗂𝗅𝗅𝖺𝗌 𝗂𝗌 𝗎𝗌𝖾 𝗍𝗈 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝖾 𝖺𝗂 𝗉𝗂𝖼𝗍𝗎𝗋𝖾𝗌 𝗎𝗌𝗂𝗇𝗀 𝗍𝖾𝗑𝗍',
  role: 0
};

module.exports.run = async function ({ api, event, args }) {
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
};
