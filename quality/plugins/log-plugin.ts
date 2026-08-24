import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

// Path to script
const EXEC_TOOL_PATH = '../scripts/parse-business-log.ts';
const GET_BUSINESS_LOG_SCRIPT_PATH = '../scripts/get-business-logs.ts';

interface clearAllLogsArgs {
  logFilePath: string;
}

export const clearAllLogs = async (
  args: clearAllLogsArgs,
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
  const command = `tsx ${EXEC_TOOL_PATH} '${logFilePath}' '${stringifiedEvent}'`;

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
  const command = `tsx ${GET_BUSINESS_LOG_SCRIPT_PATH} '${logFilePath}' '${stringifiedEvent}'`;

  const { stdout } = await asyncExec(command);

  return JSON.parse(stdout);
};

export const getAllLogs = async (
  args: hasBusinessLogArgs,
): Promise<Record<string, string>> => {
  const { logFilePath } = args;
  const command = `tsx ${GET_BUSINESS_LOG_SCRIPT_PATH} '${logFilePath}'`;

  const { stdout } = await asyncExec(command);

  return JSON.parse(stdout);
};
