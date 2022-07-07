import * as http from 'http';

export interface IHttpClientResponse {
    message: http.IncomingMessage;
    readBody(): Promise<string>;
}
