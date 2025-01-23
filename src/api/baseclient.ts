type Strategy = 'token' | 'apiKey'

export class BaseClient {
  private code: string
  private strategy: Strategy

  #BASE_URL: string

  constructor(
    baseUrl: string,
    tokenOrKey: string,
    strategy: Strategy = 'token'
  ) {
    this.strategy = strategy

    if (!baseUrl) {
      throw new Error('BaseClient needs to be instatiated with a base URL')
    }

    this.#BASE_URL = baseUrl
    this.code = tokenOrKey

    if (this.constructor === BaseClient) {
      throw new Error(
        'BaseClient is abstract and cannot be instantiated directly.'
      )
    }
  }

  async request<T>(
    endpoint: string,
    config?: RequestInit
  ): Promise<T | undefined> {
    const url = new URL(`${this.#BASE_URL}${endpoint}`)

    if (this.strategy === 'apiKey') {
      url.searchParams.set('appid', this.code)
    }

    const headers = {
      ...(this.strategy === 'token' && { Authorization: `Bearer ${this.code}` })
    }

    const response = await fetch(url.toString(), {
      ...config,
      headers: {
        ...headers,
        ...config?.headers
      }
    })

    if (response.ok) {
      return (await response.json()) as T
    }
  }

  getAuthCode() {
    return this.code
  }

  getBaseUrl() {
    return this.#BASE_URL
  }

  setAccessToken(token: string) {
    this.code = token
  }
}
