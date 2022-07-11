import { Logger } from './helpers/Logger';
import { IInvoiceRemainderService } from './services';

export class App {
    constructor(private readonly remainderService: IInvoiceRemainderService) {}

    public async init(): Promise<void> {
        try {
            this.handleGracefullyShutDownProcess();
            this.handleUnhandledRejection();
            this.hanleUncaughtException();
            await this.remainderService.sendRemainderToCustomers();
        } catch (ex: any) {
            Logger.error(ex.message);
        }
    }

    private handleGracefullyShutDownProcess(): void {
        process.on('SIGINT', () => {
            this.remainderService.kill();
        });
    }

    private handleUnhandledRejection() {
        process.on('unhandledRejection', (err: Error) => {
            Logger.error(`Unhandled Promise Rejection: reason: ${err.message}`);
            Logger.error(err.stack);
        });
    }

    private hanleUncaughtException() {
        process.on('uncaughtException', function (err: Error) {
            Logger.error(`UncaughtException: ${err.message}`);
            Logger.error(err.stack);
            process.exit(0);
        });
    }
}
