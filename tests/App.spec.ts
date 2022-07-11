import { IInvoiceRemainderService } from '../src/services';
import { App } from '../src/App';

describe('App', () => {
    let mockRemainderService;
    let app: App;
    beforeEach(async () => {
        mockRemainderService = <IInvoiceRemainderService>{
            sendRemainderToCustomers: jest.fn().mockImplementation(() => Promise.resolve()),
            killProcess: jest.fn().mockResolvedValueOnce({}),
        };
        app = new App(mockRemainderService);
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    it('should call init method', async () => {
        expect(app.init()).resolves.not.toThrow();
    });
});
