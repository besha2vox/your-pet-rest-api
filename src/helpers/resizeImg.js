const jimp = require("jimp");

const resizeImg = async (imgPath, width, height) => {
  const image = await jimp.read(imgPath);
  image.resize(width, height);
  await image.writeAsync(imgPath);
};

module.exports = resizeImg;
