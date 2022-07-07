import { RestClient } from './lib/http';

export class Startup {
    public async Start(): Promise<void> {
        let restClient = new RestClient('http://localhost:9090');
        const student = await restClient.create('/messages', {
            email: 'vdaybell0@seattletimes.com',
            text: 'Hi Vincenty, your invoice about $1.99 is due.',
        });
        console.log(student);
    }
}
