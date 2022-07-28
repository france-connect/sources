# Tracks Injector for FranceConnect+

This fixture consists on a script : `./scripts/populate-account-traces.script.js`
This script will populate the Elasticsearch database with fake FranceConnect+ business log.

- Events emitted during a connection from a public service provider
- Events emitted during a connection from a private service provider
- Expired events with date greater than 6 months.
- Events with invalid names.

## Mock data

The script processes FranceConnect+ business log templates stored as ejs files in the `./tracks` directory.

Those templates accepts 2 parameters:
- time: start time used for the event sequence in the business log template (Epoch time)
- accountId: accountId of the user

## Elasticsearch environment variables

The population script is connected to the Elasticsearch database.
The connection credentials are provided by environment variables

- `Elasticsearch_TRACKS_INDEX = "fc_tracks"` 
- `Elasticsearch_NODES = "[\"http://elasticsearch:9200\",\"https://elasticsearch:9200\"]"`
- `Elasticsearch_USERNAME = "docker-stack"`
- `Elasticsearch_PASSWORD = "docker-stack"`

## Execute the population script

Note: You need to have started elasticsearch container

```sh
# set the Elasticksearch environment variables
export Elasticsearch_TRACKS_INDEX="fc_tracks" && \
export Elasticsearch_NODES="[\"http://elasticsearch:9200\",\"https://elasticsearch:9200\"]" && \
export Elasticsearch_USERNAME="docker-stack" && \
export Elasticsearch_PASSWORD="docker-stack"

# remove the events from elasticsearch
node --trace-warnings ./populate-account-traces.script.js remove

# generate business logs for public/private sp with dates (today, 6 months minus 1 day ago, just after 6 months and 1 day ago)
# inject the events in elasticsearch
node --trace-warnings ./populate-account-traces.script.js generate test_TRACE_USER

# generate business logs using the template `/tracks/fsp1-high/public_fip1-high.mock.ejs` for the dates `20 and 21 june 2022`
# inject the events in elasticsearch
node --trace-warnings ./populate-account-traces.script.js generate test_TRACE_USER '["/tracks/fsp1-high/public_fip1-high.mock.ejs"]' '["2022-06-21","2022-06-20"]'
```
