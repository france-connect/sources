import { warn } from './log';

interface OrderErrorInterface {
  reason: string;
  type: string;
}

interface OrderItemInterface {
  status: number;
  error?: OrderErrorInterface;
}

type ItemRecord = Record<string, OrderItemInterface>;

interface ElasticSearchResultInterface {
  errors?: boolean;
  items?: ItemRecord[];
}

/*
  Example of ElasticSearch error
  {
  "took": 0,
  "ingest_took": 8,
  "errors": true,
  "items": [
    {
      "index": {
        "_index": "fc_tracks",
        "_type": "_doc",
        "_id": null,
        "status": 400,
        "error": {
          "type": "illegal_argument_exception",
          "reason": "pipeline with id [geoto] does not exist"
        }
      }
    },
    ...
  ]
}
 */

export function hasNoError(
  { errors, items }: ElasticSearchResultInterface,
  nbOfOrders: number,
): boolean {
  const isOk = !errors && items?.length === nbOfOrders;
  if (!isOk) {
    const info = items
      .map((item: ItemRecord) => Object.values(item))
      .flat()
      .filter(({ error, status }) => status >= 300 && error)
      .map(({ error }) => error)
      .map(({ reason, type }) => `<${type}: ${reason}>`)
      .join(',');
    warn(`Failed when asked ${nbOfOrders} and get ${items.length} inserts`);
    warn(`Error in ES: ${info}`);
  }
  return isOk;
}
