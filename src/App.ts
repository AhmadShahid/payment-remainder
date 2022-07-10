import { ICommandOption, ShellCommandExecutor } from './lib/shell';
import path from 'path';
import { Config } from './config/config';
import { CsvReader } from './lib/csv/CsvReader';
import { RestClient } from './lib/http';
import { IResponse } from './lib/http/contracts/IResponse';
import { HttpCodes } from './lib/http/RestClient';

export class App {
    public async init(): Promise<void> {
        try {
            this.listenProcessEvents();
            console.log(await this.startService());
            const customers = await this.readCsv();
            this.sendPaymentRemainders(customers);
            console.log('all done');
        } catch (ex) {
            console.log(ex);
        }
    }

    private async readCsv(): Promise<ICustomer[]> {
        const csvFilePath = path.resolve(__dirname, 'assets/customers.csv');
        const csvReader = new CsvReader(csvFilePath);
        return csvReader.getData<ICustomer>();
    }

    private async startService() {
        const shellExecutor = new ShellCommandExecutor(<ICommandOption>{
            command: path.resolve(__dirname, `bin/commservice.windows`),
            args: [],
        });
        await shellExecutor.execute();
    }

    private async sendHttpRequest(email: string, text: string): Promise<IResponse<IAPIMessageResponse>> {
        const restClient = new RestClient(Config.API_URL);
        return restClient.create<IAPIMessageResponse>('/messages', {
            email: email,
            text: text,
        });
    }

    private sendPaymentRemainders(customers: ICustomer[]): void {
        const paymentRemaindersMap = new Map<string, NodeJS.Timeout[]>();
        for (const customer of customers) {
            const timeIntervals = [];
            const remainderSchedules = customer.schedule.split('-').map((val) => val.replace(/s$/i, ''));
            for (const schedule of remainderSchedules) {
                const timeInterval = setTimeout(
                    async (prop) => {
                        const apiResponse = await this.sendHttpRequest(prop.email, prop.text);
                        if (apiResponse && apiResponse.statusCode === HttpCodes.Created) {
                            if (apiResponse.result && apiResponse.result.paid) {
                                console.log(`Paid No more remiders for \`${apiResponse.result.email}\`.`);
                                console.log(paymentRemaindersMap);
                                this.clearTimers(paymentRemaindersMap);
                                return;
                            }
                        }

                        clearTimeout(schedule);
                        paymentRemaindersMap.delete(`${schedule}_${customer.email}`);
                    },
                    +schedule * 1000,
                    {
                        text: customer.text,
                        email: customer.email,
                    },
                );

                timeIntervals.push(timeInterval);
            }
            paymentRemaindersMap.set(`${customer.email}`, timeIntervals);
        }
    }

    private listenProcessEvents() {
        process.on('SIGTERM', function () {
            console.log('Caught SIGTERM signal');
        });

        process.on('SIGINT', function () {
            console.log('Caught interrupt signal');
        });
    }

    private clearTimers(paymentRemaindersMap: Map<string, NodeJS.Timeout[]>) {
        // console.log(`Unscheduling ${paymentRemaindersMap.entries().length} reminders.\n`);
        for (const paymentRemainder of paymentRemaindersMap.entries()) {
            for (const iterator of paymentRemainder[1]) {
                clearTimeout(iterator);
            }
        }
    }
}
