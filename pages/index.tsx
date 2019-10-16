import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Canvas,
  extend,
  PointerEvent,
  useRender,
  useResource,
  useThree
} from 'react-three-fiber'
import { Mesh, MeshNormalMaterial } from 'three'

export default () => {
  const [ready, set] = useState(false)

  const loadControls = useCallback(async () => {
    const { OrbitControls } = await import(
      'three/examples/jsm/controls/OrbitControls'
    )

    const { TransformControls } = await import(
      'three/examples/jsm/controls/TransformControls'
    )

    extend({ OrbitControls, TransformControls })
    set(true)
  }, [])

  useEffect(() => {
    if (!ready) {
      loadControls()
    }
  }, [ready])

  return (
    <>
      {ready && (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
          <Main />
        </Canvas>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
        }

        html {
          background: #0000ee;
        }
      `}</style>
    </>
  )
}

const Main = () => {
  const orbit = useRef<any>()
  const transform = useRef<any>()
  const [ref, mesh] = useResource()
  const { camera, gl } = useThree()

  const handleDrag = useCallback(
    ({ value }) => (orbit.current.enabled = !value),
    []
  )

  const onPointerDown = useCallback(
    (e: PointerEvent) =>
      e.object instanceof Mesh &&
      e.object.material instanceof MeshNormalMaterial &&
      (e.object.material.wireframe = !e.object.material.wireframe),
    []
  )

  useRender(() => orbit.current && orbit.current.update(), false)

  useEffect(() => {
    if (transform.current) {
      transform.current.addEventListener('dragging-changed', handleDrag)
    }

    return () =>
      transform.current &&
      transform.current.removeEventListener('dragging-changed', handleDrag)
  }, [])

  return (
    <>
      <mesh {...{ ref, onPointerDown }}>
        <dodecahedronGeometry attach="geometry" />
        <meshNormalMaterial attach="material" />
      </mesh>

      <orbitControls
        ref={orbit}
        args={[camera, gl.domElement]}
        enableDamping
        dampingFactor={0.1}
      />

      {mesh && (
        <transformControls
          ref={transform}
          args={[camera, gl.domElement]}
          onUpdate={e => e.attach(mesh)}
        />
      )}
    </>
  )
}
