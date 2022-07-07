export interface IResponse<T> {
    statusCode: number | undefined;
    result: T | null;
    headers: Object;
}
