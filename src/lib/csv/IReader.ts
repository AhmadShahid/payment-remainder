export interface IReader {
    getData<T>(): Promise<T[]>;
}
