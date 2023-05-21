const express = require('express');
const router = express.Router();

const { cats: ctrl } = require('../../controllers');

router.get('/', ctrl.getAllCats);

router.get('/:id', ctrl.getCatById);

module.exports = router;
