import path from 'path';
import { Config } from './config/config';
import { CsvReader } from './lib/csv/CsvReader';

export class App {
    public async init(): Promise<void> {
        try {
            await this.readCsv();
        } catch (ex) {
            console.log(ex);
        }
    }

    private async readCsv(): Promise<void> {
        const csvFilePath = path.resolve(__dirname, 'assets/customers.csv');
        const csvReader = new CsvReader(csvFilePath);
        console.log(await csvReader.getData<ICustomer>());
    }
}
