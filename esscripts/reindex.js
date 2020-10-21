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
