const { node, auth } = require('./config').settings.elasticsearch;
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node, auth });
const { features, queryParams, showAccomodationOnly, promotions, showAllResorts } = require("./constants")

// Simple error handler and outputter used by everything
const handleError = (er, res) => {
  console.log(er)
  res.status(500).send(er)
}

// Param setter
const setParameter = (name, value) => {
  let term = Array.isArray(value) ? "terms" : "term"
  return {
    [term]: {
      [name]: value
    }
  }
}

// Runs queries against the ElasticSearch index
const doQuery = async body => {
  try {
    return await client.search({
      index: 'skiline-prices',
      body
    });
  }
  catch(e) {
    return handleError(e);
  }
}

const defaultQuery = ({size = 0, minValue, maxValue, date_min, date_max, adults, children}, aggs) => {
  return {
    size,
    track_total_hits: true,
    "query": {
      "bool": {
        "must": [
          {
            "range": {
              "now_price": {
                "gte": minValue,
                "lte": maxValue
              }
            }
          },
          {
            "range": {
              "departure_date": {
                "gte": date_min,
                "lte": date_max
              }
            }
          },
          {
            "range": {
              "beds": {
                "gte": parseInt(adults) + parseInt(children)
              }
            }
          }
        ]
      }
    },
    aggs
  }
}

const getBoardsForPropertyType = accomType => {
  switch(accomType) {
    case "chalets":
      return ["All Inclusive", "Catered Chalet", "Chalet Club Board", "Chalet Hotel", "Hotel Club Board"];
      break;
    case "hotels":
      return ["All Inclusive", "Chalet Hotel", "Half Board Hotel", "Hotel B&B", "Hotel Full Board", "Room Only", "Hotel Club Board"];
      break;
    case "apartments":
      return ["Room Only", "Self Catered Apartment", "Self-Catered Chalet"];
      break;
    case "all":
    default:
      return ["All Inclusive", "Catered Chalet", "Chalet Club Board", "Chalet Hotel", "Half Board Hotel", "Hotel B&B", "Hotel Full Board", "Room Only", "Hotel Club Board", "Room Only", "Self Catered Apartment", "Self-Catered Chalet"];
      break;
  }
}

const queryBuilder = (options, aggs) => {
  const query = defaultQuery(options, aggs);
  const q = query.query.bool.must;
  queryParams.forEach(item => {
    const {key, fieldName} = item;
    if (options[key]) {
      const param = setParameter(fieldName, options[key]);
      q.push(param);
    }
  })

  if (!options["showAccomodationOnly"] && !options["departure_airport"]) {
    query.query.bool.must_not = {
      "term": { "out_departure_airport.keyword": "Independent Travel" }
    }
  }

  if (options["property_type"]) {
    const p = getBoardsForPropertyType(options["property_type"]);
    q.push(p);
  }
  if (options["promotions"]) q.push(promotions);
  features.forEach(feature => {
    if (options[feature]) {
      const param = setParameter(feature, options[feature]);
      q.push(param);
    }
  })
  return query
}

const sortArgs = value => {
  switch (value) {
    case 'Price (Low)':
      return { "lowest_price": "asc" }
      break;

    case 'Price (High)':
      return { "lowest_price": "desc" }
      break;

    case 'Discounts':
      return { "discount": "desc" }
      break;

    case 'Date':
      return { "_key": "asc" }
      break;

    default:
      return [
          { "recommended": "desc" },
          { "lowest_price": "asc" }
        ]
      break;
  }
}

const priceAggs = ({sort_by, ext_node_id, date_min, date_max, durations, departure_airport, room_type}) => {
  const sort = sortArgs(sort_by);
  const q = {
    "size": 0,
    "query": {
      "bool": {
        "must": [
          {
            "match": { ext_node_id }
          },
          {
            "range": {
              "departure_date": {
                "gte": date_min,
                "lte": date_max
              }
            }
          }
        ]
      }
    },
    "aggs": {
      "cheapest": {
        "date_histogram": {
          "field": "departure_date",
          "interval": "1d",
          "format": "yyyy-MM-dd",
          "order": sort
        },
        "aggs": {
          "lowest_price": {
            "min": {
              "field": "now_price"
            }
          }
        }
      }
    }
  }
  if (durations) q.query.bool.must.push(setParameter('durations', durations));
  if (departure_airport) q.query.bool.must.push(setParameter('departure_airport', departure_airport));
  if (room_type) q.query.bool.must.push(setParameter('room_type', room_type));
  return q;
}

const price = id => ({
  "size": 1,
  "query": {
    "bool": {
      "must": [
        { "match": {
          "ext_node_id": id
        }},
        { "range": {
          "now_price": {
            "gte": 1
          }
        }}
      ]
    }
  },
  "sort": {
    "now_price": {
      "order": "asc"
    }
  }
});

module.exports = {
  queryBuilder,
  handleError,
  doQuery,
  sortArgs,
  priceAggs,
  price,
  test: {
    setParameter,
    defaultQuery,
    getBoardsForPropertyType
  }
}
