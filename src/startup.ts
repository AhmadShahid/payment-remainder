import { ICommandOption } from './lib/shell';
import { ShellCommandExecutor } from './lib/shell';
import { RestClient } from './lib/http';
import path from 'path';

export class Startup {
    public async Start(): Promise<void> {
        try {
            const shellExecutor = await new ShellCommandExecutor(<ICommandOption>{
                command: path.resolve(__dirname, `bin/commservice.windows`),
                args: [],
            });
            const spawnProcessinfo = shellExecutor.execute();
            console.log('spawninfo', spawnProcessinfo);

            const restClient = new RestClient('http://localhost:9090');
            const student = await restClient.create('/messages', {
                email: 'vdaybell0@seattletimes.com',
                text: 'Hi Vincenty, your invoice about $1.99 is due.',
            });
            console.log(student);
        } catch (ex) {
            console.log(ex);
        }
    }
}
