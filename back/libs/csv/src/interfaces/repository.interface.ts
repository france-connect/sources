export interface RepositoryInterface<T> {
  parse(file: string): Promise<void>;
  find(filters: { [key: string]: string }): Promise<T>;
}
