import { ICommandOption } from './lib/shell';
import { ShellCommandExecutor } from './lib/shell';
import { RestClient } from './lib/http';
import path from 'path';
import { Config } from './config/config';
import { CsvReader } from './lib/csv/CsvReader';

export class Startup {
    public async Start(): Promise<void> {
        try {
            const csvFilePath = path.resolve(__dirname, 'assets/customers.csv');
            const csvReader = new CsvReader(csvFilePath);
            console.log(await csvReader.getData<ICustomer>());
            // const shellExecutor = await new ShellCommandExecutor(<ICommandOption>{
            //     command: path.resolve(__dirname, `bin/commservice.windows`),
            //     args: [],
            // });
            // const spawnProcessinfo = shellExecutor.execute();
            // console.log('spawninfo', spawnProcessinfo);

            // const restClient = new RestClient(Config.API_URL);
            // const student = await restClient.create('/messages', {
            //     email: 'vdaybell0@seattletimes.com',
            //     text: 'Hi Vincenty, your invoice about $1.99 is due.',
            // });
            // console.log(student);
        } catch (ex) {
            console.log(ex);
        }
    }
}
