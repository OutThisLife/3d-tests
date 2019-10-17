import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, extend, useRender, useThree } from 'react-three-fiber'
import { ThemeProvider } from 'styled-components'

import Stars from '../components/Stars'
import { theme } from './_style'

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
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ThemeProvider {...{ theme }}>
          <Main />
        </ThemeProvider>
      </Canvas>
    )
  )
}

const Main = () => {
  const orbit = useRef<any>()
  const { camera, gl } = useThree()

  useRender(() => orbit.current && orbit.current.update(), false)

  return (
    <>
      <Stars />

      <perspectiveCamera
        args={[75, window.innerWidth / window.innerHeight, 0.1, 50]}
      />

      <orbitControls
        ref={orbit}
        args={[camera, gl.domElement]}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  )
}
