interface OrderErrorInterface {
  reason: string;
  type: string;
}

interface OrderItemInterface {
  status: number;
  error?: OrderErrorInterface;
}

type ItemRecord = Record<string, OrderItemInterface>;

export interface EsResultInterface {
  errors?: boolean;
  items?: ItemRecord[];
}
