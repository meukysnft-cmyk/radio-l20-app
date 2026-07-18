import { useEffect, useState } from 'react'
import { weatherLocation } from '../config/weather'

type WeatherState = {
  temperature: number
  weatherCode: number
  maxTemperature?: number
  minTemperature?: number
}

type WeatherApiResponse = {
  current?: {
    temperature_2m?: number
    weather_code?: number
  }
  daily?: {
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
  }
}

function getWeatherIcon(code: number) {
  if (code === 0) {
    return '☀️'
  }

  if ([1, 2, 3].includes(code)) {
    return '⛅'
  }

  if ([45, 48].includes(code)) {
    return '🌫️'
  }

  if (code >= 51 && code <= 67) {
    return '🌦️'
  }

  if (code >= 80 && code <= 82) {
    return '🌧️'
  }

  if (code >= 95) {
    return '⛈️'
  }

  return '🌤️'
}

function formatTemperature(value: number) {
  return Math.round(value)
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      latitude: String(weatherLocation.latitude),
      longitude: String(weatherLocation.longitude),
      current: 'temperature_2m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min',
      timezone: weatherLocation.timezone,
      forecast_days: '1',
    })

    fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha ao carregar clima.')
        }

        return response.json() as Promise<WeatherApiResponse>
      })
      .then((data) => {
        const temperature = data.current?.temperature_2m
        const weatherCode = data.current?.weather_code

        if (typeof temperature !== 'number' || typeof weatherCode !== 'number') {
          throw new Error('Resposta de clima incompleta.')
        }

        setWeather({
          temperature,
          weatherCode,
          maxTemperature: data.daily?.temperature_2m_max?.[0],
          minTemperature: data.daily?.temperature_2m_min?.[0],
        })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setHasError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  if (hasError) {
    return (
      <span className="weather-widget is-unavailable" aria-label="Clima indisponível">
        Clima indisponível
      </span>
    )
  }

  if (isLoading || !weather) {
    return (
      <span className="weather-widget is-loading" aria-label="Carregando clima de Pilar">
        Clima
      </span>
    )
  }

  const range =
    typeof weather.maxTemperature === 'number' && typeof weather.minTemperature === 'number'
      ? `Máx. ${formatTemperature(weather.maxTemperature)}°C / Mín. ${formatTemperature(weather.minTemperature)}°C`
      : undefined

  return (
    <span
      className="weather-widget"
      aria-label={`Clima em ${weatherLocation.name}: ${formatTemperature(weather.temperature)} graus Celsius${range ? `, ${range}` : ''}`}
      title={range}
    >
      <span aria-hidden="true">{getWeatherIcon(weather.weatherCode)}</span>
      <strong>{formatTemperature(weather.temperature)}°C</strong>
      <small>{weatherLocation.name}</small>
    </span>
  )
}
