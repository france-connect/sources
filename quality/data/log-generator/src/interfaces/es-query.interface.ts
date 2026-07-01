export interface EsQueryInterface {
  index: string | string[];
  // Respect ES naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  max_docs: number;
  body: Record<string, unknown>;
  refresh: boolean;
}
