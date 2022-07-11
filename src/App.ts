import { Logger } from './helpers/Logger';
import { IRemainderService } from './services/IRemainderService';
import { RemainderService } from './services/RemainderService';

export class App {
    private readonly remainderService: IRemainderService;

    constructor(remainderService: IRemainderService) {
        this.remainderService = remainderService;
    }

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
            this.remainderService.killProcess();
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
