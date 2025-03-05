import React, { Suspense, useEffect, useRef } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { useGLTF } from "@react-three/drei/native";
import modelPath from "../../public/classroom.glb";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls } from "@react-three/drei/native";

function Model(props) {
  const asset = Asset.fromModule(require("../../public/classroom.glb"));
  // Dosyayı indirip localUri elde etmek:
  if (!asset.localUri) {
    asset.downloadAsync(); // genelde bir kez çağırmak yeterli
  }
  const gltf = useLoader(
    GLTFLoader,
    asset.localUri,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      // Burada dracoLoader’ın decoder path’ini belirtmelisiniz.
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      );
      loader.setDRACOLoader(dracoLoader);
    }
  );
  gltf.scene.scale.set(0.01, 0.01, 0.01);
  return <primitive {...props} object={gltf.scene} scale={1} />;
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
