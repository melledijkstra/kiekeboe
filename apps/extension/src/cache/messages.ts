import { createMessage } from '@/messaging/system'

export const cacheImage = createMessage<string, string>('cacheImage')
