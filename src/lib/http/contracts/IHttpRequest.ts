import * as http from 'http';
import * as url from 'url';

export interface IHttpRequest {
    options: http.RequestOptions;
    url: url.Url;
    httpModule: any;
}
