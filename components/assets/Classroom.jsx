import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { loadAsync } from 'expo-three';

export default function GLBViewer() {
  const animationFrameId = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
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

    try {
      // expo-three loadAsync (ekstra parametreler ile Draco / uzantı loaderları tanıtabilirsiniz)
      const model = await loadAsync(
        'https://raw.githubusercontent.com/wass08/r3f-ai-language-teacher/main/public/models/classroom_default.glb',
        null,
        // Üçüncü parametre: hangi Three.js ek modüllerini kullanacağını belirtmek için
        fileName => require(`three/examples/jsm/loaders/${fileName}`)
      );

      // model.scene üç boyutlu sahneyi temsil eder
      model.scene.position.set(0, -1, 0);
      scene.add(model.scene);
    } catch (error) {
      console.error('GLB Load Error:', error);
    }

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
