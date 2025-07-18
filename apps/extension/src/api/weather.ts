import lscache from 'lscache'
import { Logger } from '@/logger'
import { getCurrentPosition } from '@/api/geolocation'
import type { WeatherResponse } from '@/api/definitions/openweathermap'
import { ApiKeyBaseClient } from './keybaseclient'

export type WeatherInfo = {
  location: string
  temperature: number
  icon: string
}

export type GeoPosition = {
  lat: number
  lon: number
}

const logger = new Logger('weather')

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export class WeatherClient extends ApiKeyBaseClient {
  protected urlQueryKeyName: string = 'appid'
  
  constructor() {
    super(BASE_URL, import.meta.env.VITE_WEATHER_API_KEY)
  }

  async getWeather(position?: GeoPosition): Promise<WeatherInfo | undefined> {
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
      `/weather?lat=${lat}&lon=${lon}&appid=${this.getApiKey()}`
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
