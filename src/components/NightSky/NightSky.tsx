import { useRef, useMemo } from 'react'
import { Canvas, RootState, useThree, extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Star, getStarPosition, getLST, bvToColor } from './utils'

class StarShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        pointTexture: { value: null },
        uPixelRatio: { value: 1.0 },
      },
      vertexShader: /*glsl*/ `
        attribute float a_size;
        attribute vec3 a_color;
        varying vec3 vAColor;
        uniform float uPixelRatio;

        void main() {
          vAColor = a_color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = a_size * uPixelRatio * 4.0;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /*glsl*/ `
        varying vec3 vAColor;
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);

          if (dist > 0.5) { discard; }

          float star = smoothstep(0.125, 0.02, dist);
          float halo = smoothstep(0.5, 0.1, dist) * 0.3;

          float final_alpha = clamp(star + halo, 0.0, 1.0);
          gl_FragColor = vec4(vAColor, final_alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }
}

extend({ StarShaderMaterial })

const radToDeg = 180 / Math.PI

function StarField({ stars }: { stars: Star[] }) {
  const { dpr } = useThree((state) => ({ dpr: state.viewport.dpr }))

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(stars.length * 3)
    const col = new Float32Array(stars.length * 3)
    const sizes = new Float32Array(stars.length)
    const radius = 500

    const magMin = stars.reduce((min, star) => (star.mag < min ? star.mag : min), Infinity)
    const magMax = stars.reduce((max, star) => (star.mag > max ? star.mag : max), -Infinity)
    const minRenderSize = 3.0
    const maxRenderSize = 25.0

    const flux = (mag: number) => Math.pow(10, -0.4 * mag)
    const minFlux = flux(magMax)
    const maxFlux = flux(magMin)

    stars.forEach((star, i) => {
      const p = getStarPosition(star.ra, star.dec, radius)
      pos.set([p.x, p.y, p.z], i * 3)
      const color = new THREE.Color(bvToColor(star.bv || 0.5))
      col.set([color.r, color.g, color.b], i * 3)

      const currentFlux = flux(star.mag)
      const normalizedFlux = Math.max(0, (currentFlux - minFlux) / (maxFlux - minFlux))
      sizes[i] = minRenderSize + normalizedFlux * (maxRenderSize - minRenderSize)
    })
    return [pos, col, sizes]
  }, [stars])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-a_color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-a_size" args={[sizes, 1]} />
      </bufferGeometry>
      <starShaderMaterial uPixelRatio={dpr} />
    </points>
  )
}

interface NightSkyProps {
  stars: Star[]
  lat: number
  lon: number
  date: Date
  viewAzimuth: number
  viewAltitude: number
  fov: number
}

function AnimatedSkyGroup({
  stars,
  initialRotation,
}: {
  stars: Star[]
  initialRotation: THREE.Euler
}) {
  const groupRef = useRef<THREE.Group>(null)
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      elapsedRef.current += delta
      // Earth's rotation rate: ~2PI radians per 86164.0905 seconds (1 sidereal day)
      const siderealRate = (2 * Math.PI) / 86164.0905

      groupRef.current.rotation.copy(initialRotation)
      groupRef.current.rotation.y -= elapsedRef.current * siderealRate * 60
    }
  })

  return (
    <group ref={groupRef}>
      <StarField stars={stars} />
    </group>
  )
}

export default function NightSky({
  stars,
  lat,
  lon,
  date,
  viewAzimuth,
  viewAltitude,
  fov,
}: NightSkyProps) {
  const skyRotation = useMemo(() => {
    const lst = getLST(date, lon)
    const lstLon = lst * (Math.PI / 12)
    const rotation = new THREE.Euler(Math.PI / 2 - lat, -lstLon, 0, 'ZXY')
    return rotation
  }, [lat, lon, date])

  const onCreatedHandle = (state: RootState): void => {
    const phi = Math.PI / 2 - viewAltitude
    const theta = viewAzimuth
    const target = new THREE.Vector3().setFromSphericalCoords(1, phi, theta)
    state.camera.lookAt(target)
  }

  return (
    <Canvas camera={{ fov: fov * radToDeg, position: [0, 0, 0] }} onCreated={onCreatedHandle}>
      <AnimatedSkyGroup stars={stars} initialRotation={skyRotation} />
    </Canvas>
  )
}
