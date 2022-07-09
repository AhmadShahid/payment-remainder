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

    it('execute shell command', async () => {
        const processResult = shellExecutor.execute();
        expect(processResult).resolves.not.toThrow();
    });

    it('promise reject  error if command is null', async () => {
        const shellExecutor = new ShellCommandExecutor(getCommandOption(''));
        shellExecutor.execute().catch((e) => {
            expect(e).toMatch('Error: No command found please specify command');
        });
    });
});
