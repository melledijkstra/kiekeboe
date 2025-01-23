import {
  mdiWeatherSunny,
  mdiWeatherPartlyCloudy,
  mdiWeatherCloudy,
  mdiWeatherRainy,
  mdiWeatherPartlyRainy,
  mdiWeatherLightning,
  mdiSnowflake,
  mdiWeatherFog,
  mdiCloudQuestionOutline
} from '@mdi/js'

export function weatherToMdiIcon(icon?: string) {
  switch (icon?.slice(0, 2)) {
    case '01':
      return mdiWeatherSunny
    case '02':
      return mdiWeatherPartlyCloudy
    case '03':
    case '04':
      return mdiWeatherCloudy
    case '09':
      return mdiWeatherRainy
    case '10':
      return mdiWeatherPartlyRainy
    case '11':
      return mdiWeatherLightning
    case '13':
      return mdiSnowflake
    case '50':
      return mdiWeatherFog
    default:
      return mdiCloudQuestionOutline
  }
}
