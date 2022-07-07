import { spawn } from 'child_process';
import { ICommandOption, IShellCommandExecutor } from './IShellCommandExecutor';

export class ShellCommandExecutor implements IShellCommandExecutor {
    private commandOption: ICommandOption;

    constructor(commandOption: ICommandOption) {
        this.commandOption = commandOption;
    }

    execute(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.commandOption.command) {
                reject('Error: No command found please specify command');
            }

            const spwanProcessInfo = spawn(this.commandOption.command, this.commandOption.args, {
                cwd: __dirname,
            });

            spwanProcessInfo.stdout.on('data', (data) => {
                console.log('data', data.toString());
                resolve(data.toString());
            });

            spwanProcessInfo.stderr.on('data', (data) => {
                resolve(data.toString());
            });

            spwanProcessInfo.on('error', (err) => {
                reject(err);
            });
        });
    }
}
