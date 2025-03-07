import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default function GLBViewer() {
  let animationFrameId = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1, 5);

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Setup loaders
    const loader = new GLTFLoader();

    // Load GLB
    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    const normalTexture = textureLoader.load("https://raw.githubusercontent.com/kafeinberkcolakk/ai-for-kidz/master/assets/test/BakedTextures.jpg");

    // GLTFLoader ile .gltf dosyasını yükleme
    loader.load(
      "https://raw.githubusercontent.com/kafeinberkcolakk/ai-for-kidz/master/assets/untitled.gltf",
      (gltf) => {
        // Modeldeki tüm mesh’leri dolaş
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            // Manuel texture atama
            child.material.map = diffuseTexture;
            child.material.normalMap = normalTexture;
            child.material.needsUpdate = true;
          }
        });
        scene.add(gltf.scene);
      },
      undefined,
      (error) => console.error("GLTF Load Error:", error)
    );

    // Render loop
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
}
