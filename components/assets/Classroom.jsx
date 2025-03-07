import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

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
    loader.load(
      'https://raw.githubusercontent.com/kafeinberkcolakk/ai-for-kidz/master/assets/untitled.glb',
      (gltf) => {
        gltf.scene.position.set(0, -1, 0);
        scene.add(gltf.scene);
      },
      undefined,
      (error) => console.error('GLB Load Error:', error)
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
