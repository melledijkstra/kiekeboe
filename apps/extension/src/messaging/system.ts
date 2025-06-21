import { log } from '@/logger'
import browser from 'webextension-polyfill'

type Message = {
  identifier: string
  data?: unknown
}

type Handler<Request, Response> = (
  request: Request
) => Response | Promise<Response>

const isMessage = (msg: unknown): msg is Message => {
  return msg !== null && typeof msg === 'object' && 'identifier' in msg
}

export function createMessage<Request = void, Response = void>(identifier: string) {
  return {
    async send(data: Request): Promise<Response> {
      log('Sending message:', identifier)
      const response = await browser.runtime.sendMessage<Message, Response>({
        identifier,
        data
      })
      return response
    },
    on(callback: Handler<Request, Response>) {
      browser.runtime.onMessage.addListener(
        (message, _sender, sendResponse) => {
          if (isMessage(message) && message.identifier === identifier) {
            const promise = callback(message?.data as Request)
            Promise.resolve(promise).then((r) => {
              sendResponse(r)
            })
            return true
          }
        }
      )
    }
  }
}
