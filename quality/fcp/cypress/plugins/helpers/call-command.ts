import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

export function getCallerFrom(cmd: string, ctx: string[] = []) {
  return async (params = ''): Promise<void> => {
    const command = `${[...ctx, 'export CI=1'].join(' ')}; ${cmd} ${params}`;
    // eslint-disable-next-line no-console
    console.log(`Call: ${command}`);
    try {
      const { stderr, stdout } = await asyncExec(command);

      if (stderr) {
        // eslint-disable-next-line no-console
        console.log(`stderr: ${stderr}`);
      }
      // eslint-disable-next-line no-console
      console.log(`stdout: ${stdout}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new Error(`Failed to call script ${cmd}`);
    }
  };
}
