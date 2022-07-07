import { IHttpClientResponse } from './IHttpClientResponse';

export interface IHeaders {
    [key: string]: any;
}

export interface IHttpClient {
    get(requestUrl: string, additionalHeaders?: IHeaders): Promise<IHttpClientResponse>;
    del(requestUrl: string, additionalHeaders?: IHeaders): Promise<IHttpClientResponse>;
    post(
        requestUrl: string,
        data: string | NodeJS.ReadableStream,
        additionalHeaders?: IHeaders,
    ): Promise<IHttpClientResponse>;
    patch(
        requestUrl: string,
        data: string | NodeJS.ReadableStream,
        additionalHeaders?: IHeaders,
    ): Promise<IHttpClientResponse>;
    put(
        requestUrl: string,
        data: string | NodeJS.ReadableStream,
        additionalHeaders?: IHeaders,
    ): Promise<IHttpClientResponse>;
    request(
        verb: string,
        requestUrl: string,
        data: string | NodeJS.ReadableStream,
        headers: IHeaders,
    ): Promise<IHttpClientResponse>;
}
