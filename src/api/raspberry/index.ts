export const RASPBERRY_HOST_NAME = 'raspberrypi.local';
export const RASPBERRY_PORT = 3000;

let isAlive = false;

export const isRaspberryAlive = async (): Promise<boolean> => {
  try {
    const response = await fetch(`http://${RASPBERRY_HOST_NAME}:${RASPBERRY_PORT}/status`);
    return response.status === 200;
  } catch (error) {
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
