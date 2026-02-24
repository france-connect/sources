export interface EntityIdLocationInterface {
  readonly src: 'body' | 'params' | 'query';
  readonly key: string;
}
