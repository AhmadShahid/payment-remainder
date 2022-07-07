import * as url from 'url';
import { IHeaders, IHttpClient } from './contracts/IHttpClient';
import { IHttpClientResponse } from './contracts/IHttpClientResponse';
import { IHttpRequest } from './contracts/IHttpRequest';
import * as http from 'http';
import * as https from 'https';
import { HttpClientResponse } from './HttpClientResponse';
import { IRequestOptions } from './contracts/IRequestOption';
import * as util from './Util';

export class HttpClient implements IHttpClient {
    private requestOptions: IRequestOptions | undefined;

    constructor(requestOptions?: IRequestOptions) {
        this.requestOptions = requestOptions;
    }

    get(requestUrl: string, additionalHeaders?: IHeaders | undefined): Promise<IHttpClientResponse> {
        return this.request('GET', requestUrl, '', additionalHeaders || {});
    }

    del(requestUrl: string, additionalHeaders?: IHeaders | undefined): Promise<IHttpClientResponse> {
        return this.request('DELETE', requestUrl, '', additionalHeaders || {});
    }

    post(requestUrl: string, data: string, additionalHeaders?: IHeaders | undefined): Promise<IHttpClientResponse> {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }

    patch(
        requestUrl: string,
        data: string | NodeJS.ReadableStream,
        additionalHeaders?: IHeaders | undefined,
    ): Promise<IHttpClientResponse> {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }

    put(requestUrl: string, data: string, additionalHeaders?: IHeaders | undefined): Promise<IHttpClientResponse> {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }

    public async request(
        verb: string,
        requestUrl: string,
        data: string | NodeJS.ReadableStream,
        headers: IHeaders,
    ): Promise<IHttpClientResponse> {
        const info: IHttpRequest = this.prepareRequest(verb, requestUrl, headers);
        return new Promise<IHttpClientResponse>((resolve, reject) => {
            const callbackForResult = function (err: unknown, res: IHttpClientResponse) {
                if (err) {
                    reject(err);
                }

                resolve(res);
            };

            this.requestWithCallback(info, data, callbackForResult);
        });
    }

    private requestWithCallback(
        info: IHttpRequest,
        data: string | NodeJS.ReadableStream,
        onResult: (err: unknown, res: IHttpClientResponse) => void,
    ): void {
        try {
            const req: http.ClientRequest = info.httpModule.request(info.options, (msg: http.IncomingMessage) => {
                const res: HttpClientResponse = new HttpClientResponse(msg);
                onResult(null, res);
            });

            req.on('error', function (err) {
                onResult(err, <IHttpClientResponse>{});
            });

            if (data) req.write(data, 'utf8');
            req.end();
        } catch (ex) {
            onResult(ex, <IHttpClientResponse>{});
        }
    }

    private prepareRequest(method: string, requestUrl: string, headers: IHeaders): IHttpRequest {
        const info: IHttpRequest = <IHttpRequest>{};

        info.url = util.parseUrl(requestUrl);

        info.httpModule = util.isHttps(requestUrl) ? https : http;
        const defaultPort: number = util.isHttps(requestUrl) ? 443 : 80;

        info.options = <http.RequestOptions>{};
        info.options.host = info.url.hostname;
        info.options.port = info.url.port ? parseInt(info.url.port) : defaultPort;
        info.options.path = (info.url.pathname || '') + (info.url.search || '');
        info.options.method = method;

        info.options.headers = this.getHeaders(info.url, headers);
        return info;
    }

    private getHeaders(url: url.Url, headers: IHeaders): http.OutgoingHttpHeaders {
        const newHeaders: http.OutgoingHttpHeaders | https.RequestOptions = {
            Host: url.host?.toString(),
        };

        if (headers) Object.entries(headers).map((value) => (newHeaders[value[0]] = value[1]));
        return newHeaders;
    }
}
