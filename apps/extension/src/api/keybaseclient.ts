import { BaseClient } from "./baseclient"

export class ApiKeyBaseClient extends BaseClient {
  private apiKey: string

  constructor(
    baseUrl: string,
    apiKey: string,
  ) {
    super(baseUrl)

    if (!apiKey) {
      throw new Error('ApiKeyBaseClient needs to be instantiated with a valid API key.')
    }

    this.apiKey = apiKey

    if (this.constructor === ApiKeyBaseClient) {
      throw new Error(
        'ApiKeyBaseClient is abstract and cannot be instantiated directly.'
      )
    }
  }

  async request<T>(
    endpoint: string,
    config?: RequestInit,
  ): Promise<T | undefined> {
    const searchParams = new URLSearchParams()
    searchParams.set('key', this.apiKey)
    return super.request(endpoint, config, searchParams);
  }

  getApiKey() {
    return this.apiKey
  }

  setApiKey(token: string) {
    this.apiKey = token
  }
}
