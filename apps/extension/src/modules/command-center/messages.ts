import { createMessage } from "@/messaging";

export const commandCenterOpen = createMessage<void, void>('commandCenterOpen');