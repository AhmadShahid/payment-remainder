import path from 'path';
import { APP_PATH } from './RootPath';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBinaryCommand(): string {
    let osBinaryCommandPath;
    switch (process.platform) {
        case 'win32':
            osBinaryCommandPath = path.resolve(APP_PATH, `bin/commservice.windows`);
            break;
        case 'linux':
            osBinaryCommandPath = path.resolve(APP_PATH, `bin/commservice.linux`);
            break;
        case 'darwin':
            osBinaryCommandPath = path.resolve(APP_PATH, `bin/commservice.mac`);
            break;
        default:
            osBinaryCommandPath = path.resolve(APP_PATH, `bin/commservice.windows`);
            break;
    }
    return osBinaryCommandPath;
}
