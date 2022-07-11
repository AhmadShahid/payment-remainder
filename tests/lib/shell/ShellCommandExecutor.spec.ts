import { ICommandOption, IShellCommandExecutor } from '../../../src/lib/shell';
import { ShellCommandExecutor } from '../../../src/lib/shell';

const getCommandOption = (command: string) => {
    return <ICommandOption>{
        command: command,
        args: [`--module`],
        cwd: true,
    };
};

describe('ShellCommandExecutor', () => {
    let shellExecutor: IShellCommandExecutor;
    beforeEach(async () => {
        shellExecutor = new ShellCommandExecutor(getCommandOption('node'));
    });

    it('should be defined', () => {
        expect(shellExecutor).toBeDefined();
    });

    it('should execute shell command', async () => {
        const processResult = await shellExecutor.execute();
        expect(processResult).toMatch('node: bad option: --module');
    });

    it('promise reject  error if command is null', async () => {
        const shellExecutor = new ShellCommandExecutor(getCommandOption(''));
        shellExecutor.execute().catch((e) => {
            expect(e).toMatch('Error: No command found please specify command');
        });
    });
});
