export interface EsQueryInterface {
  index: string | string[];
  size: number;
  body: Record<string, unknown>;
  refresh: boolean;
}
