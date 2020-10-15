const { node, auth } = require('./config').settings.elasticsearch;
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node, auth });
const { searchAggs, optionsAggs } = require('./constants');
const { queryBuilder, handleError, sortArgs, priceOptions, priceAggs, priceQuery, price } = require('./helpers');

async function getData(req, res) {
  try {
    const body = queryBuilder(req.query, searchAggs)
    const results = await client.search({
      index: 'skiline-prices',
      body
    })
    const { page, page_size } = req.query;
    let filteredResults = [];
    const startPos = page*page_size
    for(var i=startPos; i<startPos+page_size; i++) {
      filteredResults.push(results.body.hits.hits[i]);
    }
    res.status(200).json({
      filteredResults,
      totalLocations: results.body.hits.hits.length
    })
  }
  catch(er) {
    handleError(er, res);
  }
}

async function getOptions(req, res) {
  try {
    const query = {...req.query, ...{ size: 0 }};
    const body = queryBuilder(query, optionsAggs);
    const result = await client.search({
      index: 'skiline-prices',
      body
    })
    res.status(200).json(result)
  }
  catch(er) {
    handleError(er, res);
  }
}

// //TODO: Remove if not used **
async function getProperty(req, res) {
  try {
    res.status(200).json('/getProperty - OK')
  }
  catch(er) {
    handleError(er, res);
  }
}

async function getAllResorts() {
  try {
    const body = queryBuilder(options, showAllResorts);
    return await client.search({
      index: 'skiline-prices',
      body: body
    })
  }
  catch(er) {
    handleError(er, res);
  }
}

async function getPrices(req, res) {
  try {
    const id = req.query.ext_node_id;
    const optionsBody = priceOptions(id);
    const options = await client.search({
      index: 'skiline-prices',
      body: optionsBody
    });
    const priceBody = priceAggs(req.query)
    const result = await client.search({
      index: 'skiline-prices',
      body: priceBody
    });
    const { buckets } = result.body.aggregations.cheapest;
    const results = buckets.map(item => {
      const { value } = item.lowest_price;
      if (value) {
        const price = priceQuery(id, value, item.key_as_string, req.query);
        return price.hits.hits[0]._source;
      }
    }).filter(x => x);
    const response = [results, {options}];
    res.status(200).json(response);
  }
  catch(er) {
    handleError(er, res);
  }
}

async function getLowestPrice(req, res) {
  try {
    const id = req.query.ext_node_id;
    const body = price(id)
    const result = await client.search({
      index: 'skiline-prices',
      body
    });
    res.status(200).json(result);
  }
  catch(er) {
    handleError(er, res);
  }
}

module.exports = {
  getData,
  getOptions,
  getProperty,
  getPrices,
  getLowestPrice
}
