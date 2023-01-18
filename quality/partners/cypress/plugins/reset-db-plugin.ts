import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

export async function resetDbSPConfigurations(
  appName: string,
): Promise<number> {
  if (!appName) {
    throw new Error('the appName parameter is required to reset the database');
  }
  const command = `export CI=1; $FC_ROOT/fc/docker/docker-stack exec ${appName} yarn typeorm:fixtures:reset-config-test`;
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
    return 0;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw new Error(`Failed to call script ${command}`);
  }
}
