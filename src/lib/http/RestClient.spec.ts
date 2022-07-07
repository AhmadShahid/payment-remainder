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
        const res: unknown = { name: 'foo' };
        const restRes = await restClient.create('/post', res);
        expect(restRes.statusCode).toBe(200);
    });

    it('Should throw 404', async () => {
        const res: unknown = { name: 'foo' };
        const restRes = await restClient.create('/postss', res);
        expect(restRes.statusCode).toBe(404);
    });
});
