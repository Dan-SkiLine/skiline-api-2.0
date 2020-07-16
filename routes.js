const express = require('express');
const { getData, getOptions, getProperty, getPrices, getLowestPrice } = require('./controller.js');

const router = express.Router();

router.get('/', getData);
router.get('/options', getOptions);
router.get('/property', getProperty); //TODO: Remove if not useds
router.get('/prices', getPrices);
router.get('/price', getLowestPrice);

module.exports = router;
