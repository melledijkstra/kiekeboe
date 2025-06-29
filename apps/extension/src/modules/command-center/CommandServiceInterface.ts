import type { CommandGroups } from "./types";

export interface CommandServiceInterface {
  get commands(): CommandGroups;
  execute(input: string): void;
  initialize(): void;
  destroy(): void;
}
