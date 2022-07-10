import { IHeaders, IHttpClient } from './contracts/IHttpClient';
import { IRequestOptions } from './contracts/IRequestOption';
import { IResponse } from './contracts/IResponse';
import { IRestClientOption } from './contracts/IRestClientOption';
import { HttpClient } from './HttpClient';
import { HttpClientResponse } from './HttpClientResponse';
import * as util from './Util';

export enum HttpCodes {
    OK = 200,
    Created = 201,
    MultipleChoices = 300,
    MovedPermanently = 301,
    ResourceMoved = 302,
    SeeOther = 303,
    NotModified = 304,
    UseProxy = 305,
    SwitchProxy = 306,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    TooManyRequests = 429,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
}

export class RestClient {
    baseUrl: string | undefined;
    client: IHttpClient;

    constructor(baseUrl?: string, requestOptions?: IRequestOptions) {
        this.client = new HttpClient(requestOptions);
        if (baseUrl) this.baseUrl = baseUrl;
    }

    public async create<T>(resource: string, body: unknown, options?: IRestClientOption): Promise<IResponse<T>> {
        const url: string = util.getUrl(resource, this.baseUrl);
        const headers: IHeaders = this._headersFromOptions(options);
        console.log(`URLLLLL`, resource);
        // console.log(headers);
        const data: string = JSON.stringify(body, null, 2);
        const res: HttpClientResponse = await this.client.post(url, data, headers);
        return this.processResponse<T>(res);
    }

    private _headersFromOptions(options: IRestClientOption = {}): IHeaders {
        const headers: IHeaders = options.additionalHeaders || {};
        headers['Accept'] = options.acceptHeader || 'application/json';
        headers['Content-Type'] = 'application/json; charset=utf-8';

        return headers;
    }

    private async processResponse<T>(res: HttpClientResponse): Promise<IResponse<T>> {
        return new Promise<IResponse<T>>(async (resolve, reject) => {
            const statusCode: number | undefined = res.message.statusCode;

            const response: IResponse<T> = {
                statusCode: statusCode,
                result: null,
                headers: {},
            };

            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }

            let obj: any;
            let contents: string;

            try {
                response.headers = res.message.headers;
                if (statusCode && statusCode > 299) {
                    const msg: string = 'Failed request: (' + statusCode + ')';
                    reject(msg);
                } else {
                    contents = await res.readBody();
                    if (contents && contents.length > 0) {
                        obj = JSON.parse(contents);
                        response.result = obj;
                    }
                    resolve(response);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
