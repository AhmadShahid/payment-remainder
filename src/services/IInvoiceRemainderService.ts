export interface IInvoiceRemainderService {
    sendRemainderToCustomers(): Promise<void>;
    killProcess(): void;
}
