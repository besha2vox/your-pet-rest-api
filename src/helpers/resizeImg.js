const Jimp = require("jimp");

const resizeImg = async (imgPath, width, height) => {
  const image = await Jimp.read(imgPath);
  await image.resize(width, height).writeAsync(imgPath);
};


module.exports = resizeImg;
