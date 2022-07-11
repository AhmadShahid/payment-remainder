export interface IRemainderService {
    sendRemainderToCustomers(): Promise<void>;
    killProcess(): void;
}
