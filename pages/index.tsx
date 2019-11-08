import anime from 'animejs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'

import { theme } from './_style'

const Main = () => {
  const {
    camera,
    mouse,
    viewport: { width, height },
    raycaster
  } = useThree()

  const ceil = useRef<any>()
  const bird = useRef<any>()
  const floor = useRef<any>()

  const obstacles = useRef<React.ReactNode[]>([])

  const meshes = useMemo(
    () =>
      [...Array(10).keys()].map(i => (
        <group
          key={i}
          ref={r => obstacles.current.push(r)}
          position-x={1.15 * (7 - i)}
          position-y={-(height / 2) * Math.random()}
          scale-y={1 * Math.random()}>
          <mesh>
            <boxGeometry
              attach="geometry"
              args={[
                0.15,
                height / 1.2 + (height / 1.2) * Math.random(),
                3,
                5,
                100
              ]}
            />

            <meshBasicMaterial
              attach="material"
              color={theme.fg}
              transparent
              wireframe
            />
          </mesh>
        </group>
      )),
    []
  )

  useFrame(() => {
    for (let i = 0, l = obstacles.current.length; i < l; i++) {
      const o = obstacles.current[i] as any

      if (o) {
        if (o.children[0].material.opacity < -0.1) {
          o.position.x = Math.max(width / 2, width / 2 + 0.15 * Math.random())
          o.scale.y = 1 * Math.random()

          o.children.forEach(c => {
            c.position.y = -(height / 2) * Math.random()
            c.material.wireframe = true
            c.material.color = new THREE.Color(theme.fg)
          })
        } else {
          o.position.x -= 0.05
        }

        o.children.forEach(
          c =>
            (c.material.opacity = (width / 2 - Math.abs(o.position.x)) / width)
        )
      }
    }

    raycaster.intersectObjects(obstacles.current as any, true).forEach(i => {
      if (i.object instanceof THREE.Mesh) {
        const o = i.object as any

        if (o.animation && !o.animation.completed) {
          return
        }

        o.animation = anime({
          targets: o,
          positionY: [o.position.y, 10],
          begin: () => {
            o.material.wireframe = false
            o.material.color = new THREE.Color(0xf00000)
          },
          update: ({ progress }) => {
            const r = progress / 100
            o.position.y = -(10 * 4) * r
          }
        })
      }
    })

    if (bird.current) {
      bird.current.position.x = 4 * mouse.x
      bird.current.position.y = 4 * mouse.y
    }

    raycaster.setFromCamera(mouse, camera)
  })

  return (
    <>
      <group ref={ceil} position-y={height / 2}>
        {meshes}
      </group>

      <group ref={bird}>
        <mesh castShadow>
          <torusKnotGeometry attach="geometry" args={[0.1, 0.02, 100]} />
          <meshNormalMaterial attach="material" />
        </mesh>
      </group>

      <group ref={floor} position-y={height / -2}>
        <mesh>
          <boxGeometry attach="geometry" args={[width, 0.95, 1, 100]} />
          <meshBasicMaterial attach="material" color={theme.fg} wireframe />
        </mesh>
      </group>
    </>
  )
}

export default () => {
  const [ready, set] = useState(false)

  const loadControls = useCallback(async () => {
    const { OrbitControls } = await import(
      'three/examples/jsm/controls/OrbitControls'
    )

    extend({ OrbitControls })
    set(true)
  }, [])

  useEffect(() => {
    if (!ready) {
      loadControls()
    }
  }, [ready])

  return (
    ready && (
      <Canvas style={{ width: '100vw', height: '100vh' }} shadowMap>
        <Main />
      </Canvas>
    )
  )
}
