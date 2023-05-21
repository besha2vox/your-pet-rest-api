const { Cat } = require('../db/models');
const { RequestError } = require('../helpers');
const { ctrlWrapper } = require('../middlewares');

const getAllCats = async (req, res) => {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Cat.find({}, '', {
        skip,
        limit: Number(limit),
    });
    const totalHints = await Cat.count();

    res.status(200).json({
        result,
        page: Number(page),
        hints: Number(limit),
        totalHints,
    });
};

const getCatById = async (req, res) => {
    const { id } = req.params;
    const result = await Cat.findById(id);

    if (!result) {
        throw new RequestError(404, `Cat with id: ${id} is not found`);
    }

    res.status(200).json({ result });
};

module.exports = {
    getCatById: ctrlWrapper(getCatById),
    getAllCats: ctrlWrapper(getAllCats),
};
