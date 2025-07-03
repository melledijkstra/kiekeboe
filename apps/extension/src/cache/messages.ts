import { createMessage } from '@/messaging'

export const cacheImage = createMessage<string, string>('cacheImage')
