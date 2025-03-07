import React, { Suspense, useEffect, useRef } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { Gltf, useGLTF } from "@react-three/drei/native";
import modelPath from "../../public/classroom.glb";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls } from "@react-three/drei/native";
import Assets from "../../public/classroom.glb"
function Model(props) {
  return <Gltf src={Assets} scale={1}  />;
}

export default function GLBViewer() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ height: "100%", width: "100%" }}>
      <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </View>
  );
}
