import { IReader } from '../../src/lib/csv';
import { IShellCommandExecutor } from '../../src/lib/shell';
import { IInvoiceRemainderService, InvoiceRemainderService } from '../../src/services';
import { IAPIMessageResponse, ICustomer } from '../../src/entities/customer';
import { IRestClient } from '../../src/lib/http/RestClient';
import { IResponse } from '../../src/lib/http/contracts/IResponse';

describe('InvoiceRemainderService', () => {
    let invoiceRemainderService: IInvoiceRemainderService;
    beforeEach(async () => {
        const mockShellCommandExecutor = <IShellCommandExecutor>{
            execute: jest.fn().mockImplementation(() => Promise.resolve('execute')),
            kill: jest.fn().mockImplementation(),
        };
        const mockCsvReader = <IReader>{
            getData: jest.fn().mockImplementation(() =>
                Promise.resolve(<ICustomer[]>[
                    {
                        email: 'shahidahmad527@gmail.com',
                        text: 'Hi Test',
                        schedule: '1s-2s-8s',
                    },
                ]),
            ),
        };

        const mockRestClient = <IRestClient>{
            create: jest.fn().mockImplementation(() =>
                Promise.resolve(<IResponse<IAPIMessageResponse>>{
                    statusCode: 201,
                    result: <IAPIMessageResponse>{
                        email: 'shahidahmad527@gmail.com',
                        text: 'Hi Shahid',
                        paid: false,
                    },
                }),
            ),
        };
        invoiceRemainderService = new InvoiceRemainderService(mockShellCommandExecutor, mockCsvReader, mockRestClient);
    });

    it('should be defined', () => {
        expect(invoiceRemainderService).toBeDefined();
    });

    // it('should call sendRemainderToCustomers method', async () => {
    //     expect(invoiceRemainderService.sendRemainderToCustomers()).resolves.not.toThrow();
    // });
});
