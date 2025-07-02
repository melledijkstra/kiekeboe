export interface BackgroundService {
  initialize(): Promise<void>;
  destroy(): void;
}