import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

// Path to script
const EXEC_TOOL_PATH = '../scripts/parse-business-log.ts';
const GET_BUSINESS_LOG_SCRIPT_PATH = '../scripts/get-business-logs.ts';

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

export const getBusinessLogs = async (
  args: hasBusinessLogArgs,
): Promise<Record<string, string>> => {
  const { event, logFilePath } = args;
  const stringifiedEvent = JSON.stringify(event);
  const command = `ts-node ${GET_BUSINESS_LOG_SCRIPT_PATH} '${logFilePath}' '${stringifiedEvent}'`;

  const { stdout } = await asyncExec(command);

  return JSON.parse(stdout);
};

export const getAllBusinessLogs = async (
  args: hasBusinessLogArgs,
): Promise<Record<string, string>> => {
  const { logFilePath } = args;
  const command = `ts-node ${GET_BUSINESS_LOG_SCRIPT_PATH} '${logFilePath}'`;

  const { stdout } = await asyncExec(command);

  return JSON.parse(stdout);
};
