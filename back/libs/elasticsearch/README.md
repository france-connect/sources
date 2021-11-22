# Library desciption

This library is a simple Elasticsearch wrapper that embed the configuration
setted in the environment vars: `/fc-docker/compose/fc-core.yml:152`:

- `Elasticsearch_PROTOCOL = 'http'`
- `Elasticsearch_HOST = 'localhost'`;
- `Elasticsearch_PORT = 9200`;

## Usage

To use this library you have to import it with the handy method `register()` provided in this lib:

```js
import { ElasticsearchModule } from '@fc/elasticsearch';
...

@Module({
  imports: [
    ElasticsearchModule.register(),
    ...,
  ],
  controllers: [...],
  providers: [...],
})
```

## View data in Elasticsearch

### Index

You can display info about a specific index of the database :

- Ex: [http://localhost:9200/\_cat/indices/fc_tracks?v=true&s=index](http://localhost:9200/_cat/indices/fc_tracks?v=true&s=index)

### Content of a specific index

- Ex: [http://localhost:9200/fc_tracks/\_search?pretty](http://localhost:9200/fc_tracks/_search?pretty)

## Testing mocks values

A script places in `./back/apps/csmr-tracks/fixtures/**` can populate the database with fake data
for a testing purpose.
