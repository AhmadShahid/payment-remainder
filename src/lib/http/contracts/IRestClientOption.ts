import { IHeaders } from './IHttpClient';

export interface IRestClientOption {
    acceptHeader?: string;
    additionalHeaders?: IHeaders;
    queryParameters?: { [key: string]: unknown };
}
