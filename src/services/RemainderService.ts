import { ShellCommandExecutor } from '../lib/shell';
import { ICommandOption, IShellCommandExecutor } from '../lib/shell/IShellCommandExecutor';
import { IRemainderService } from './IRemainderService';
import path from 'path';
import { IReader } from '../lib/csv/IReader';
import { CsvReader } from '../lib/csv/CsvReader';
import { RestClient } from '../lib/http';
import { HttpCodes, IRestClient } from '../lib/http/RestClient';
import { Config } from '../config/config';
import { IResponse } from '../lib/http/contracts/IResponse';
import { sleep } from '../util';
import { Logger } from '../helpers/Logger';

export class RemainderService implements IRemainderService {
    private shellCommandExecutor: IShellCommandExecutor;
    private csvReader: IReader;
    private restClient: IRestClient;

    constructor() {
        this.shellCommandExecutor = new ShellCommandExecutor(<ICommandOption>{
            command: this.getBinaryCommand(),
            args: [],
        });
        this.csvReader = new CsvReader(path.resolve(process.cwd(), 'assets/customers.csv'));
        this.restClient = new RestClient(Config.API_URL);
    }

    async sendRemainderToCustomers() {
        const processOutput = await this.startService();
        Logger.log(processOutput);
        Logger.log('--------------- Reading customers.csv ---------------');
        const customers = await this.readCsv();
        Logger.log('--------------- sending remainders ---------------');
        await this.sendPaymentInvoiceRemainders(customers);
        Logger.log('--------------- Press control + C to stop  app and see results ---------------');
    }

    killProcess(): void {
        this.shellCommandExecutor.kill();
    }

    private async startService(): Promise<string> {
        return this.shellCommandExecutor.execute();
    }

    private async readCsv(): Promise<ICustomer[]> {
        return this.csvReader.getData<ICustomer>();
    }

    private async sendHttpRequest(email: string, text: string): Promise<IResponse<IAPIMessageResponse>> {
        return this.restClient.create<IAPIMessageResponse>('/messages', {
            email: email,
            text: text,
        });
    }

    private async sendPaymentInvoiceRemainders(customers: ICustomer[]) {
        const promises: Promise<void>[] = [];
        for (const customer of customers) {
            const promise: Promise<void> = new Promise(async (resolve, reject) => {
                try {
                    const scheduledTimesInSec: number[] = this.getCustomerSchedules(customer);
                    let index = 0;
                    while (index < scheduledTimesInSec.length) {
                        const nextRunInSec =
                            index === 0
                                ? scheduledTimesInSec[0]
                                : scheduledTimesInSec[index] - scheduledTimesInSec[index - 1];

                        const apiResponse: IResponse<IAPIMessageResponse> = await this.scheduleMessage(
                            customer.email,
                            customer.text,
                            nextRunInSec * 1000,
                            scheduledTimesInSec[index],
                        );

                        if (this.isInvoicePaid(apiResponse)) {
                            Logger.log(`invoice for ${apiResponse.result?.email} is paid now`);
                            break;
                        }

                        index++;
                    }
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            promises.push(promise);
        }

        return Promise.all(promises);
    }

    private async scheduleMessage(
        email: string,
        text: string,
        sleepTime: number,
        outputTime: number,
    ): Promise<IResponse<IAPIMessageResponse>> {
        return new Promise(async (resolve, reject) => {
            try {
                await sleep(sleepTime);
                process.nextTick(async () => {
                    Logger.log(`${outputTime} : sending email to ${email} `);
                    const apiResponse = await this.sendHttpRequest(email, text);
                    resolve(apiResponse);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    private isInvoicePaid(apiResponse: IResponse<IAPIMessageResponse>): boolean {
        if (apiResponse && apiResponse.statusCode === HttpCodes.Created) {
            if (apiResponse.result && apiResponse.result.paid) return true;
        }
        return false;
    }

    private getCustomerSchedules(customer: ICustomer): number[] {
        return customer.schedule.split('-').map((timeInSeconds: string) => Number(timeInSeconds.slice(0, -1)));
    }

    private getBinaryCommand(): string {
        let osBinaryCommandPath;
        switch (process.platform) {
            case 'win32':
                osBinaryCommandPath = path.resolve(process.cwd(), `bin/commservice.windows`);
                break;
            case 'linux':
                osBinaryCommandPath = path.resolve(process.cwd(), `bin/commservice.linux`);
                break;
            case 'darwin':
                osBinaryCommandPath = path.resolve(process.cwd(), `bin/commservice.mac`);
                break;
            default:
                osBinaryCommandPath = path.resolve(process.cwd(), `bin/commservice.windows`);
                break;
        }
        return osBinaryCommandPath;
    }
}
