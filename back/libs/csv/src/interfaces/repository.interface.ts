export interface RepositoryInterface<T> {
  parse(file: string): Promise<void>;
  createIndex(column: string): void;
  getByIndex(index: string, key: string): T | null;
  find(filters: { [key: string]: string }): Promise<T>;
}
