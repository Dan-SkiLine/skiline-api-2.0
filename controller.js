const { node, auth } = require('./config').settings.elasticsearch;
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node, auth });
const { searchAggs, optionsAggs } = require('./constants');
const { queryBuilder, handleError, sortArgs, priceAggs, price, doQuery } = require('./helpers');
const { getHolidayItemQuery, priceQuery, getPropertyPriceOptionsQuery } = require('./queries');

/**
 * [getData is the main bread and butter function for search results]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function getData(req, res) {
  try {
    const { page, page_size, sort_by } = req.query
    // this can be split out into its own function
    // gets inital buckets aggregation to filter and return results in the next step
    const bucketSort = sortArgs(sort_by);
    const bucketAggs = searchAggs(bucketSort);
    const bucketQuery = queryBuilder(req.query, bucketAggs);
    const buckets = await doQuery(bucketQuery);
    const bucketResults = buckets.body.aggregations.bucketResults.buckets;
    const totalLocation = bucketResults.slice(0);
    // this can be split out into its own function
    // splits the results into a page and fetches each item to add to the result set
    const startPos = parseInt(page*page_size);
    const endPos = startPos+parseInt(page_size);
    const pagedResults = bucketResults.slice(startPos, endPos);
    const filteredResults = pagedResults.map(async result => {
      try {
        const { key, lowest_price } = result
        const resultQuery = getHolidayItemQuery(key, lowest_price, req.query);
        const actualResult = await doQuery(resultQuery);
        return actualResult.body.hits.hits[0]._source;
      }
      catch(e) {
        return handleError(e)
      }
    })

    // finally, exec the promises and return the results and the count
    Promise.all(filteredResults).then(filteredResults => {
      res.status(200).json({
        filteredResults,
        totalLocations: bucketResults.length
      })
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
    const optionsBody = getPropertyPriceOptionsQuery(id);
    const options = await client.search({
      index: 'skiline-prices',
      body: optionsBody
    });
    const pricesBody = priceAggs(req.query)
    const result = await client.search({
      index: 'skiline-prices',
      body: pricesBody
    });
    const { buckets } = result.body.aggregations.cheapest;
    const promises = buckets.map(async item => {
      const { value } = item.lowest_price;
      if (value) {
        const priceBody = priceQuery(id, value, item.key_as_string, req.query);
        const priceResult = await doQuery(priceBody);
        return priceResult.body.hits.hits[0]._source;
      }
    })

    Promise.all(promises).then(results => {
      const response = results.filter(x => x !== undefined)
      response.push({options: options})
      res.status(200).json(response);
    })
  }
  catch(er) {
    handleError(er, res);
  }
}

async function getLowestPrice(req, res) {
  try {
    const id = req.query.ext_node_id;
    const body = price(id);
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
