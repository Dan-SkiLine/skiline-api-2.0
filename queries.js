
/**
 * [getHolidayItemQuery gets each individual line item using the search results provided by the / endpoint]
 * @param  {[type]} id                [the record id of the holiday]
 * @param  {[type]} price             [the now_price of the holiday]
 * @param  {[type]} departure_airport [description]
 * @param  {[type]} date_min          [description]
 * @param  {[type]} date_max          [description]
 * @return {[JSON]}                   [Returns a JSON object ]
 */
const getHolidayItemQuery = (ext_node_id, now_price, {departure_airport, date_min, date_max}) => {
  const query = {
    "size": 1,
    "query": {
      "bool": {
        "must": [
          { "term": { ext_node_id }},
          { "term": { now_price }},
          { "range": {
            "departure_date": {
              "gte": date_min,
              "lte": date_max
            }
          }}
        ]
      }
    }
  }

  if (departure_airport)
    query.query.bool.must.push({ "term": { "out_departure_airport.keyword": departure_airport } });

  return query;
}

/**
 * [priceQuery description]
 * @param  {[type]} id     [description]
 * @param  {[type]} price  [description]
 * @param  {[type]} date   [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
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

/**
 * [getPropertyPriceOptionsQuery fetches a list of availability]
 * @param  {[int]} id [the id of the thing]
 * @return {[JSON]}    [description]
 */

const getPropertyPriceOptionsQuery = id => ({
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

module.exports = {
  getHolidayItemQuery,
  priceQuery,
  getPropertyPriceOptionsQuery
}
