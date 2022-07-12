import { App } from './App';
import { getRemainderService } from './services';

const bootstrapApp = async () => {
    new App(getRemainderService()).init();
};

bootstrapApp();
