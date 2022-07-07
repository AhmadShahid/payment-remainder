import * as url from 'url';
import { IHttpClientResponse } from './contracts/IHttpClientResponse';

export function parseUrl(requestUrl: string): url.Url {
    return url.parse(requestUrl);
}
export function isHttps(requestUrl: string) {
    let parsedUrl: url.Url = parseUrl(requestUrl);
    return parsedUrl.protocol === 'https:';
}

export function obtainContentCharset(response: IHttpClientResponse): string {
    const nodeSupportedEncodings = ['ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex'];
    const contentType: string = response.message.headers['content-type'] || '';
    const matches: RegExpMatchArray | null = contentType.match(/charset=([^;,\r\n]+)/i);

    return matches && matches[1] && nodeSupportedEncodings.indexOf(matches[1]) != -1 ? matches[1] : 'utf-8';
}

export function getUrl(resource: string, baseUrl?: string): string {
    let requestUrl = '';

    if (!baseUrl) {
        requestUrl = resource;
    } else {
        requestUrl = `${baseUrl}${resource}`;
    }

    return requestUrl;
}
