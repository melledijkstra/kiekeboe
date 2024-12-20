
export function log(...data: any[]) {
  if (import.meta.env.MODE === 'development') {
    console.log(...data);
  }
}
