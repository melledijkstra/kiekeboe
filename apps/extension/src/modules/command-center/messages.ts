import { createMessage } from "@/messaging/system";

export const commandCenterOpen = createMessage<void, void>('commandCenterOpen');