'use client'

import { useState, useEffect } from 'react'
import NightSky from './NightSky/NightSky'
import { Star } from './NightSky/utils'
import styles from './StarBackground.module.scss'

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 52.237, // Warsaw - every Pole knows that it is the default city
    lon: 21.0175,
  })

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${basePath}/stars.json`)
      .then((res) => res.json())
      .then((data: Star[]) => setStars(data))
      .catch((err) => console.error('Failed to load stars:', err))

    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          setCoords({
            lat: data.latitude,
            lon: data.longitude,
          })
        }
      })
      .catch((error) => {
        console.warn('GeoIP lookup failed, using default location:', error)
      })
  }, [])

  if (stars.length === 0) return null

  const degToRad = Math.PI / 180
  const fov = 60 * degToRad

  return (
    <div className={styles.container}>
      <NightSky
        stars={stars}
        lat={coords.lat * degToRad}
        lon={coords.lon * degToRad}
        date={new Date()}
        viewAzimuth={0}
        viewAltitude={coords.lat * degToRad - fov / 2}
        fov={fov}
      />
    </div>
  )
}
