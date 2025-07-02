import { log } from "@/logger";

let isAlive = false;

export const isRaspberryAlive = async (databaseUri?: string): Promise<boolean> => {
  const _databaseUri = databaseUri ?? 'http://raspberrypi.local:3000';
  log('Checking if Raspberry Pi is alive', {
    uri: _databaseUri
  });
  try {
    const response = await fetch(`${_databaseUri}/status`);
    return response.status === 200;
  } catch {
    return false;
  }
};

export const useRaspberryStatus = (): {
  timerId: number | null;
  isAlive: boolean;
} => {
  const checkStatus = async () => {
    isAlive = await isRaspberryAlive();
  };

  checkStatus();

  const timerId = setInterval(checkStatus, 5000); // Check every 5 seconds

  return {
    timerId,
    isAlive
  }
};
