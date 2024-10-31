/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 public\models\BMS-project.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

const BMS_Model = (props) => {
  const { nodes, materials } = useGLTF('./models/BMS-project.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Wall.geometry} material={materials.Material} position={[-1.373, 0, -0.612]} />
      <mesh geometry={nodes.Floor.geometry} material={materials.Wood} position={[0.042, -0.999, 0.027]} scale={[2.413, 1, 1.642]} />
      <group position={[-2.207, -0.231, -1.45]} scale={[0.165, 0.158, 0.159]}>
        <mesh geometry={nodes.Cube007_1.geometry} material={materials['Material.002']} />
        <mesh geometry={nodes.Cube007_2.geometry} material={materials['Black Wood']} />
      </group>
      <group position={[-2.369, -0.111, 0.302]} scale={[0.005, 0.059, 0.059]}>
        <mesh geometry={nodes.Cube012_1.geometry} material={materials['Switch.001']} />
        <mesh geometry={nodes.Cube012_2.geometry} material={materials['Green Light.001']} />
      </group>
      <mesh geometry={nodes.Wall001.geometry} material={materials['black wall']} position={[-1.373, 0, -0.612]} />
      <group position={[1.504, 0, -1.599]} scale={[0.078, 0.078, 0.012]}>
        <mesh geometry={nodes.Cube003_1.geometry} material={materials['Material.005']} />
        <mesh geometry={nodes.Cube003_2.geometry} material={materials.Switch} />
        <mesh geometry={nodes.Cube003_3.geometry} material={materials['Green Light.001']} />
      </group>
      <group position={[-0.807, -0.945, -0.519]} rotation={[Math.PI / 2, 0, -2.615]} scale={[0.024, 0.013, 0.024]}>
        <mesh geometry={nodes.Cylinder133.geometry} material={materials.MAC} />
        <mesh geometry={nodes.Cylinder133_1.geometry} material={materials['Material.004']} />
        <mesh geometry={nodes.Cylinder133_2.geometry} material={materials.Switch} />
        <mesh geometry={nodes.Cylinder133_3.geometry} material={materials.wood3} />
        <mesh geometry={nodes.Cylinder133_4.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Cylinder133_5.geometry} material={materials.wheel} />
      </group>
      <mesh geometry={nodes.Cube.geometry} material={materials.Switch} position={[-2.138, 0.779, -1.57]} scale={[0.125, 0.093, 0.041]} />
      <mesh geometry={nodes.Cube001.geometry} material={materials['Black Wood']} position={[-2.2, 0.784, -1.526]} scale={[0.024, 0.032, 0.009]} />
      <mesh geometry={nodes.Cube002.geometry} material={materials['Black Wood']} position={[-2.156, 0.784, -1.526]} scale={[0.009, 0.032, 0.009]} />
      <mesh geometry={nodes.Cube003.geometry} material={materials['Green Light.001']} position={[-2.201, 0.738, -1.537]} scale={[0.024, 0.003, 0.009]} />
      <mesh geometry={nodes.Cube004.geometry} material={materials['Green Light.001']} position={[-2.108, 0.738, -1.537]} scale={[0.058, 0.003, 0.009]} />
      <group position={[1.7, -0.18, -1.385]} rotation={[0.222, 0.962, 0.687]} scale={0.186}>
        <mesh geometry={nodes.Icosphere016.geometry} material={materials['Material.008']} />
        <mesh geometry={nodes.Icosphere016_1.geometry} material={materials['Material.007']} />
      </group>
      <group position={[1.721, -0.18, -1.359]} rotation={[0.222, 0.962, 0.687]} scale={0.186}>
        <mesh geometry={nodes.Icosphere024.geometry} material={materials['Material.006']} />
        <mesh geometry={nodes.Icosphere024_1.geometry} material={materials['Material.003']} />
      </group>
      <mesh geometry={nodes.Cube005.geometry} material={materials.DOOR} position={[-2.428, -0.184, 1.035]} scale={[-0.058, -0.814, -0.456]} />
      <mesh geometry={nodes.Cube007.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube006.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube008.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube009.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube010.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube011.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube012.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube013.geometry} material={materials['Material.009']} position={[-2.383, -0.301, 0.697]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.008, -0.008]} />
      <mesh geometry={nodes.Cube014.geometry} material={materials.DOOR} position={[-2.383, -0.301, 0.536]} rotation={[0, 0, -Math.PI]} scale={[-0.004, -0.01, -0.011]} />
    </group>
  )
}
export default BMS_Model;
useGLTF.preload('./models/BMS-project.glb')
