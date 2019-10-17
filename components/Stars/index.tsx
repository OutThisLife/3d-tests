import { useMemo, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'

export default () => (
  <>
    <WM
      color={new THREE.Color('#070707')}
      emissive={new THREE.Color('#070707')}
    />

    <WM
      color={new THREE.Color('#E4E2BF')}
      emissive={new THREE.Color('#10100E')}
      blending={THREE.AdditiveBlending}
    />

    <pointLight args={[0xffffff, 2, 0]} position={[0, 0, 0]} />
  </>
)

const WM = ({ reverse = false, ...props }) => {
  const ref = useRef<any>()
  const { camera } = useThree()

  useFrame(() => {
    if (!ref.current) {
      return
    }

    ref.current.position.x = camera.position.x
    ref.current.position.y = camera.position.y
    ref.current.position.z = camera.position.z

    ref.current.rotation.y += 0.0012
  })

  const rotation = useMemo(() => new THREE.Euler(1.5, 0, 0), [])

  return (
    <mesh {...{ ref, rotation }}>
      <cylinderGeometry
        attach="geometry"
        args={[0.8, 0.8, 100, 32, 32, true]}
      />

      <meshLambertMaterial
        attach="material"
        side={THREE.DoubleSide}
        overdraw={0.5}
        {...props}
      />
    </mesh>
  )
}
