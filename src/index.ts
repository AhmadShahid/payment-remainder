import { Startup } from './startup';

const boostrapApp = async () => {
    try {
        new Startup().Start();
    } catch (ex) {
        console.error(ex);
    }
};

boostrapApp();
