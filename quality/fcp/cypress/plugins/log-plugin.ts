import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

// Path to script
const EXEC_TOOL_PATH = '../scripts/parse-business-log.ts';

interface clearBusinessLogArgs {
  logFilePath: string;
}

export const clearBusinessLog = async (
  args: clearBusinessLogArgs,
): Promise<number> => {
  const { logFilePath } = args;
  const command = `echo "" > '${logFilePath}'`;
  let exitCode = 0;
  try {
    await asyncExec(command);
  } catch (err) {
    exitCode = err.code;
  }
  return exitCode;
};

interface hasBusinessLogArgs {
  event: Record<string, unknown>;
  logFilePath: string;
}

export const hasBusinessLog = async (
  args: hasBusinessLogArgs,
): Promise<number> => {
  const { event, logFilePath } = args;
  const stringifiedEvent = JSON.stringify(event);
  const command = `ts-node ${EXEC_TOOL_PATH} '${logFilePath}' '${stringifiedEvent}'`;

  let exitCode = 0;
  try {
    await asyncExec(command);
  } catch (err) {
    exitCode = err.code;
  }
  return exitCode;
};
