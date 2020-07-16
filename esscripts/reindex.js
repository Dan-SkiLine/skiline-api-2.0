curl -X POST "localhost:9200/_reindex?pretty" -H 'Content-Type: application/json' -d'
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

curl -X POST "http://134.213.168.195:9200/"
