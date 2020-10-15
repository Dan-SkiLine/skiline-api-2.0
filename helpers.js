const { features, queryParams, showAccomodationOnly, promotions, showAllResorts } = require("./constants")

const handleError = (er, res) => {
  console.log(er)
  res.status(500).send(er)
}

const setParameter = (name, value) => {
  let term = Array.isArray(value) ? "terms" : "term"
  return {
    [term]: {
      [name]: value
    }
  }
}

const defaultQuery = ({size = 10000, minValue, maxValue, date_min, date_max, adults, children}, aggs) => {
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

const priceOptions = id => ({
  "size": 0,
  "track_total_hits": true,
  "query": {
    "bool": {
      "must": [{
         "match": {
            id
        }
      }]
    }
  },
  "aggs": {
    "durations": {
      "terms": {
        "field": "duration",
        "order": {
          "_key": "asc"
        }
      }
    },
    "airports": {
      "terms": {
        "field": "out_departure_airport.keyword",
        "order": {
          "_key": "asc"
        }
      }
    },
    "rooms": {
      "terms": {
        "field": "room_type.keyword",
        "order": {
          "_key": "asc"
        }
      }
    }
  }
})

const getPrices = id => {
  return 0;
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
  if (options["showAccomodationOnly"]) q.push(showAccomodationOnly)
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

const priceQuery = (id, price, date, params) => {
  const q = {
    "size": 1,
    "query": {
      "bool": {
        "must": [
          { "match": {
            "ext_node_id": id
          }},
          { "match": {
            "now_price": price
          }},
          {	"range": {
              "departure_date": {
                "gte": date,
                "lte": date
              }
            }
          },
        ]
      }
    }
  }
  if (params.departure_airport) q.query.bool.must.push({"match": { "out_departure_airport.keyword": params.departure_airport }})
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
  sortArgs,
  priceOptions,
  priceAggs,
  priceQuery,
  price,
  test: {
    setParameter,
    defaultQuery,
    getBoardsForPropertyType
  }
}
