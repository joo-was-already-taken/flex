import { Vector3 } from 'three'
import { julian, sidereal } from 'astronomia'

export interface Star {
  ra: number
  dec: number
  mag: number
  bv?: number
}

export function getStarPosition(ra: number, dec: number, radius: number): Vector3 {
  const phi = Math.PI / 2.0 - dec
  return new Vector3(
    -radius * Math.sin(phi) * Math.sin(ra),
    radius * Math.cos(phi),
    -radius * Math.sin(phi) * Math.cos(ra),
  )
}

/**
 * @param {Date} date
 * @param {number} lon Observer's longitude in radians
 * @returns {number} Local Sidereal Time in hours
 */
export function getLST(date: Date, lon: number): number {
  const dayMinutes = date.getUTCMinutes() + date.getUTCSeconds() / 60
  const dayHours = date.getUTCHours() + dayMinutes / 60
  const jd = julian.CalendarGregorianToJD(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate() + dayHours / 24,
  )

  const gmst_seconds = sidereal.mean(jd) // GMST in seconds

  const gmst_hours = gmst_seconds / 3600

  // convert longitude from radians to hours
  const lon_hours = lon * (12 / Math.PI)

  let lst_hours = (gmst_hours + lon_hours) % 24
  if (lst_hours < 0) lst_hours += 24

  return lst_hours
}

export function bvToColor(bv: number): string {
  // Ballesteros' formula for converting B-V to Kelvin
  let t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62))

  // Tanner Helland's algorithm
  t /= 100
  let r, g, b
  if (t <= 66) {
    r = 255
    g = t
    g = 99.4708025861 * Math.log(g) - 161.1195681661
    if (t <= 19) {
      b = 0
    } else {
      b = t - 10
      b = 138.5177312231 * Math.log(b) - 305.0447927307
    }
  } else {
    r = t - 60
    r = 329.698727446 * Math.pow(r, -0.1332047592)
    g = t - 60
    g = 288.1221695283 * Math.pow(g, -0.0755148492)
    b = 255
  }

  const clamp = (val: number) => Math.min(Math.max(Math.round(val), 0), 255)
  const toHex = (c: number) => {
    const hex = clamp(c).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
