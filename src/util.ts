import path from 'path';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBinaryCommand(): string {
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
