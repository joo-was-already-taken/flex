import { Object3DNode } from '@react-three/fiber'
import { StarShaderMaterial } from '../components/NightSky/NightSky'

declare module '@react-three/fiber' {
  interface ThreeElements {
    starShaderMaterial: Object3DNode<StarShaderMaterial, typeof StarShaderMaterial>
  }
}
