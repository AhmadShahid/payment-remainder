import * as http from 'http';
import { IHttpClientResponse } from './contracts/IHttpClientResponse';
import * as util from './Util';

export class HttpClientResponse implements IHttpClientResponse {
    constructor(message: http.IncomingMessage) {
        this.message = message;
    }

    public message: http.IncomingMessage;
    readBody(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const chunks: Buffer[] = [];
            const encodingCharset = util.obtainContentCharset(this);
            this.message
                .on('data', function (data: string | Buffer) {
                    const chunk = typeof data === 'string' ? Buffer.from(data) : data;
                    chunks.push(chunk);
                })
                .on('end', async function () {
                    const buffer: Buffer = Buffer.concat(chunks);
                    resolve(buffer.toString(<BufferEncoding>encodingCharset));
                })
                .on('error', function (err) {
                    reject(err);
                });
        });
    }
}
