export interface IInvoiceRemainderService {
    sendRemainderToCustomers(): Promise<void>;
    kill(): void;
}
