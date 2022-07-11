import { Config } from '../../config/config';
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
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
}

export interface IRestClient {
    create<T>(resource: string, body: unknown, options?: IRestClientOption): Promise<IResponse<T>>;
}

export class RestClient implements IRestClient {
    baseUrl: string | undefined;
    client: IHttpClient;

    constructor(baseUrl?: string, requestOptions?: IRequestOptions) {
        this.client = new HttpClient(requestOptions);
        if (baseUrl) this.baseUrl = baseUrl;
    }

    public async create<T>(resource: string, body: unknown, options?: IRestClientOption): Promise<IResponse<T>> {
        const url: string = util.getUrl(resource, this.baseUrl);
        const headers: IHeaders = this._headersFromOptions(options);
        const data: string = JSON.stringify(body);
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

export const getRestClient = () => new RestClient(Config.API_URL);
