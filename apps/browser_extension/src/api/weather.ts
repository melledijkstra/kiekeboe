import lscache from 'lscache'
import { BaseClient } from './baseclient'
import { Logger } from '@/logger'
import { getCurrentPosition } from '@/modules/weather/geolocation'
import type { WeatherResponse } from '@/api/definitions/openweathermap'

export type WeatherInfo = {
  location: string
  temperature: number
  icon: string
}

const logger = new Logger('weather')

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export class WeatherClient extends BaseClient {
  constructor() {
    super(BASE_URL, import.meta.env.VITE_WEATHER_API_KEY, 'apiKey')
  }

  async getWeather(position?: {
    lat: number
    lon: number
  }): Promise<WeatherInfo | undefined> {
    const data = lscache.get('weather')
    if (data) {
      logger.log('weather data from lscache')
      return data as WeatherInfo
    }

    let lat = position?.lat
    let lon = position?.lon

    if (!position) {
      const pos = await getCurrentPosition()
      lat = pos?.[0]
      lon = pos?.[1]
    }

    const response = await this.request<WeatherResponse>(
      `/weather?lat=${lat}&lon=${lon}&appid=${this.getAuthCode()}`
    )

    if (response) {
      logger.log('retrieved weather data from API, storing in cache')
      const info: WeatherInfo = {
        location: response.name,
        temperature: response.main.temp,
        icon: response.weather[0].icon
      }
      lscache.set('weather', info, 60) // cache for 1 hour
      return info
    }
  }
}
