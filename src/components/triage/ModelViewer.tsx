// components/ModelViewer.tsx
import React, { FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model: FC = () => {
  const { scene } = useGLTF('/models/human_body.glb');
  return <primitive object={scene} />;
};

const ModelViewer: FC = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model />
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer;
