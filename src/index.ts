import { App } from './App';
import { getRemainderService } from './services';

const boostrapApp = async () => {
    new App(getRemainderService()).init();
};

boostrapApp();
