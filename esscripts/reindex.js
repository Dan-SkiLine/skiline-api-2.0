curl -u elastic:vfOK12.0912pf! -X GET "localhost:9200/skiline-prices"
curl -u elastic:vfOK12.0912pf! -X DELETE "localhost:9200/skiline-prices"
curl -u elastic:vfOK12.0912pf! -X PUT "localhost:9200/skiline-prices"
curl -u elastic:vfOK12.0912pf! -X POST "localhost:9200/_reindex?pretty" -H 'Content-Type: application/json' -d'
{
  "source": {
    "remote": {
      "host": "http://134.213.168.195:9200"
    },
    "index": "skiline-prices",
    "query": {
      "match_all": {}
    }
  },
  "dest": {
    "index": "skiline-prices"
  }
}
'

/**************************************************************************************************
 * LOCAL VERSION
 * @type {[type]}
 */
curl -u elastic:sk4md1sk -X DELETE "localhost:9200/skiline-prices"
curl -u elastic:sk4md1sk -X PUT "localhost:9200/skiline-prices"
curl -u elastic:sk4md1sk -X POST "localhost:9200/_reindex?pretty" -H 'Content-Type: application/json' -d'
{
  "source": {
    "remote": {
      "host": "http://134.213.168.195:9200"
    },
    "index": "skiline-prices"
  },
  "dest": {
    "index": "skiline-prices"
  }
}
'


// fix map
curl -u elastic:vfOK12.0912pf! -X PUT "localhost:9200/skiline-prices-new" -H 'Content-Type: application/json' -d'
{
    "mappings" : {
      "properties" : {
        "adults_only" : {
          "type" : "long"
        },
        "all_ensuite" : {
          "type" : "long"
        },
        "all_not_ensuite" : {
          "type" : "long"
        },
        "beds" : {
          "type" : "long"
        },
        "board" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "chalet_grade" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "childcare" : {
          "type" : "long"
        },
        "corporate" : {
          "type" : "long"
        },
        "country_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "departure_date" : {
          "type" : "date"
        },
        "distance_toCentre" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "distance_toLift" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "distance_toPiste" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "duration" : {
          "type" : "long"
        },
        "ext_country_id" : {
          "type" : "long"
        },
        "ext_node_id" : {
          "type" : "long"
        },
        "ext_resort_id" : {
          "type" : "long"
        },
        "filename" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "hot_tub" : {
          "type" : "long"
        },
        "imageURL" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_arrival_airport" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_arrival_airport_code" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_atime" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_carrier" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_departure_airport_code" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_dtime" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_flightnum" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "in_house_creche" : {
          "type" : "long"
        },
        "in_resort_driver" : {
          "type" : "long"
        },
        "local_pass_inc" : {
          "type" : "long"
        },
        "mot" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "nearly_ski_in_ski_out" : {
          "type" : "long"
        },
        "now_price" : {
          "type" : "long"
        },
        "open_fire" : {
          "type" : "long"
        },
        "operator_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_arrival_airport_code" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_atime" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_carrier" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_departure_airport" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_departure_airport_code" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_dtime" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "out_flightnum" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "pool" : {
          "type" : "long"
        },
        "private_bus" : {
          "type" : "long"
        },
        "private_chauffeur" : {
          "type" : "long"
        },
        "process_id" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "promotions" : {
          "properties" : {
            "book_by_date" : {
              "type" : "date"
            },
            "description" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "promotionid" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            },
            "title" : {
              "type" : "text",
              "fields" : {
                "keyword" : {
                  "type" : "keyword",
                  "ignore_above" : 256
                }
              }
            }
          }
        },
        "property_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "recommended" : {
          "type" : "long"
        },
        "ref_url" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "resort_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "return_date" : {
          "type" : "date"
        },
        "room_type" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "sauna" : {
          "type" : "long"
        },
        "shared_driver" : {
          "type" : "long"
        },
        "short_breaks" : {
          "type" : "long"
        },
        "single_room" : {
          "type" : "long"
        },
        "ski_in_ski_out" : {
          "type" : "long"
        },
        "stars" : {
          "type" : "long"
        },
        "steam_room" : {
          "type" : "long"
        },
        "was_price" : {
          "type" : "long"
        },
        "wifi" : {
          "type" : "long"
        }
      }
    }
}
'

curl -u elastic:vfOK12.0912pf! -X PUT "localhost:9200/skiline-prices" -H 'Content-Type: application/json' -d'
{ "mappings":{ "properties":{ "adults_only":{ "type":"long" }, "all_ensuite":{ "type":"long" }, "all_not_ensuite":{ "type":"long" }, "beds":{ "type":"long" }, "board":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "chalet_grade":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "childcare":{ "type":"long" }, "corporate":{ "type":"long" }, "country_name":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "departure_date":{ "type":"date" }, "distance_toCentre":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "distance_toLift":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "distance_toPiste":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "duration":{ "type":"long" }, "ext_country_id":{ "type":"long" }, "ext_node_id":{ "type":"long" }, "ext_resort_id":{ "type":"long" }, "filename":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "hot_tub":{ "type":"long" }, "imageURL":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_arrival_airport":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_arrival_airport_code":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_atime":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_carrier":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_departure_airport_code":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_dtime":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_flightnum":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "in_house_creche":{ "type":"long" }, "in_resort_driver":{ "type":"long" }, "local_pass_inc":{ "type":"long" }, "mot":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "nearly_ski_in_ski_out":{ "type":"long" }, "now_price":{ "type":"long" }, "open_fire":{ "type":"long" }, "operator_name":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "out_arrival_airport_code":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "out_atime":{ "type":"long" }, "out_carrier":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "out_departure_airport":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "out_departure_airport_code":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "out_dtime":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "out_flightnum":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "pool":{ "type":"long" }, "private_bus":{ "type":"long" }, "private_chauffeur":{ "type":"long" }, "process_id":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "promotions":{ "properties":{ "book_by_date":{ "type":"date" }, "description":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "promotionid":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "title":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } } } }, "property_name":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "recommended":{ "type":"long" }, "ref_url":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "resort_name":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "return_date":{ "type":"date" }, "room_type":{ "type":"text", "fields":{ "keyword":{ "type":"keyword", "ignore_above":256 } } }, "sauna":{ "type":"long" }, "shared_driver":{ "type":"long" }, "short_breaks":{ "type":"long" }, "single_room":{ "type":"long" }, "ski_in_ski_out":{ "type":"long" }, "stars":{ "type":"long" }, "steam_room":{ "type":"long" }, "was_price":{ "type":"long" }, "wifi":{ "type":"long" } } } }'

curl -u elastic:vfOK12.0912pf! -X POST localhost:9200/_reindex -H 'Content-Type: application/json' -d'
{
  "source": {
    "index": "skiline-prices"
  },
  "dest": {
    "index": "skiline-prices-new"
  }
}
