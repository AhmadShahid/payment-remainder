import { getRemainderService } from './services/RemainderService';
import { App } from './App';

const boostrapApp = async () => {
    new App(getRemainderService()).init();
};

boostrapApp();
