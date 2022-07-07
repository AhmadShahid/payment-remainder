import { RestClient } from './RestClient';

describe('RestClient', () => {
    let restClient: RestClient;
    beforeEach(async () => {
        restClient = new RestClient('https://httpbin.org');
    });

    it('should be defined', () => {
        expect(restClient).toBeDefined();
    });

    it('creates a resource', async () => {
        let res: any = { name: 'foo' };
        let restRes = await restClient.create('/post', res);
        expect(restRes.statusCode).toBe(200);
    });

    it('Should throw 404', async () => {
        let res: any = { name: 'foo' };
        let restRes = await restClient.create('/postss', res);
        expect(restRes.statusCode).toBe(404);
    });
});
