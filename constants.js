const features = [
  "ski_in_ski_out",
  "hot_tub",
  "childcare",
  "pool",
  "sauna",
  "steam_room",
  "wifi",
  "all_ensuite",
  "corporate",
  "single_room",
  "short_breaks",
  "adults_only",
  "ski_area",
  "nearly_ski_in_ski_out",
  "open_fire",
  "all_not_ensuite",
  "in_house_creche",
  "private_bus",
  "private_chauffeur",
  "shared_driver",
  "in_resort_driver",
  "local_pass_inc",
];

const queryParams = [
  { key: "departure_airport", fieldName: "out_departure_airport.keyword" },
  { key: "country", fieldName: "country_name.keyword" },
  { key: "grade", fieldName: "chalet_grade.keyword" },
  { key: "resorts", fieldName: "resort_name.keyword" },
  { key: "durations", fieldName: "duration" },
  { key: "boards", fieldName: "board.keyword" },
  { key: "stars", fieldName: "stars" },
];

const optionsAggs = {
  durations: {
    terms: {
      field: "duration",
      order: {
        _key: "asc",
      },
      size: 20,
    },
  },
  resorts: {
    terms: {
      field: "resort_name.keyword",
      order: {
        _key: "asc",
      },
      size: 1000,
    },
  },
  countries: {
    terms: {
      field: "country_name.keyword",
      order: {
        _key: "asc",
      },
      size: 50,
    },
  },
  departure_airports: {
    terms: {
      field: "out_departure_airport.keyword",
      order: {
        _key: "asc",
      },
      size: 50,
    },
  },
  boards: {
    terms: {
      field: "board.keyword",
      order: {
        _key: "asc",
      },
      size: 20,
      min_doc_count: 0,
    },
  },
  stars: {
    terms: {
      field: "stars",
      order: {
        _key: "desc",
      },
      min_doc_count: 0,
    },
  },
  features: {
    filter: { match_all: {} },
    aggs: {
      "Hot Tub": {
        sum: {
          field: "hot_tub",
        },
      },
      Sauna: {
        sum: {
          field: "sauna",
        },
      },
      "Swimming Pool": {
        sum: {
          field: "pool",
        },
      },
      "Wi-Fi": {
        sum: {
          field: "wifi",
        },
      },
      Childcare: {
        sum: {
          field: "childcare",
        },
      },
      "Ski in/ Ski out": {
        sum: {
          field: "ski_in_ski_out",
        },
      },
      "Special Offers": {
        sum: {
          field: "promotions",
        },
      },
    },
  },
};

const searchAggs = (sort) => {
  return {
    bucketResults: {
      terms: {
        field: "ext_node_id",
        size: 100000,
        order: sort,
      },
      aggs: {
        lowest_price: {
          min: {
            field: "now_price",
          },
        },
        recommended: {
          min: {
            field: "recommended",
          },
        },
        discount: {
          max: {
            field: "was_price",
            script: {
              source: "doc.was_price.value - doc.now_price.value",
            },
          },
        },
      },
    },
  };
};

const showAccommodationOnly = {
  term: {
    "out_departure_airport.keyword": "Independent Travel",
  },
};

const promotions = {
  nested: {
    path: "promotions",
    query: {
      bool: {
        must: [
          {
            exists: {
              field: "promotions.promotionid",
            },
          },
        ],
      },
    },
  },
};

const showAllResorts = {
  resorts: {
    terms: [
      {
        field: "resort_name.keyword",
        order: {
          _key: "asc",
        },
        size: 1000,
      },
    ],
  },
};

module.exports = {
  features,
  queryParams,
  optionsAggs,
  searchAggs,
  showAccommodationOnly,
  promotions,
  showAllResorts,
};
