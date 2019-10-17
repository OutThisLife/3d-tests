import { useMemo, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'

export default () => (
  <>
    <WM
      speed={0.001}
      geo={{
        args: [0.8, 0.8, 50, 32, 32, true]
      }}
      mat={{
        color: new THREE.Color('#E4E2BF'),
        emissive: new THREE.Color('#10100E'),
        side: THREE.BackSide
      }}
    />

    <WM
      speed={0.01}
      geo={{
        args: [0.8, 0.8, 50, 32, 32, true]
      }}
      mat={{
        color: new THREE.Color('#070707'),
        emissive: new THREE.Color('#070707'),
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      }}
    />

    <Light />
  </>
)

const WM = ({ geo = {}, mat, speed }) => {
  const ref = useRef<any>()
  const { camera, clock } = useThree()

  useFrame(() => {
    if (!ref.current) {
      return
    }

    ref.current.position.x = camera.position.x
    ref.current.position.y = camera.position.y
    ref.current.position.z = camera.position.z

    ref.current.rotation.y +=
      Math.sin((2e5 * clock.getDelta()) % Math.PI) * speed
  })

  return (
    <mesh {...{ ref }} rotation-x={1.5} rotation-y={0.1}>
      <cylinderGeometry attach="geometry" {...geo} />
      <meshLambertMaterial attach="material" {...mat} />
    </mesh>
  )
}

const Light = () => {
  const ref = useRef<any>()

  return (
    <pointLight {...{ ref }} args={[0xffffff, 2.2, 10]} position={[0, 0, 0]} />
  )
}
