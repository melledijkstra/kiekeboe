import { log } from "@/logger";

export const isRaspberryAlive = async (databaseUri?: string): Promise<boolean> => {
  const _databaseUri = databaseUri ?? 'http://raspberrypi.local:3000';
  log('Checking if Raspberry Pi is alive', {
    uri: _databaseUri
  });
  try {
    const response = await fetch(`${_databaseUri}/status`, { priority: 'low', signal: AbortSignal.timeout(2000) });
    return response.status === 200;
  } catch {
    return false;
  }
};
