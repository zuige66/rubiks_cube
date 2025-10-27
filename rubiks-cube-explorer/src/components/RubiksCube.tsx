'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RubiksCubeProps {
  style: 'grid' | 'glass';
  highlightCenters: boolean;
  highlightEdges: boolean;
  highlightCorners: boolean;
  highlightWhites: boolean;
  showNumbers: boolean;
  showFaces: boolean;
  rotationSpeed?: number;
}

export default function RubiksCube({
  style,
  highlightCenters,
  highlightEdges,
  highlightCorners,
  highlightWhites,
  showNumbers,
  showFaces,
  rotationSpeed = 1,
}: RubiksCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      35,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Create Rubik's Cube
    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    const cubeSize = 0.95;
    const gap = 0.05;
    const colors = {
      front: 0xebebeb, // White
      back: 0xffff00, // Yellow
      right: 0x059b23, // Green
      left: 0x0000ff, // Blue
      top: 0xc80507, // Red
      bottom: 0xff8c00, // Orange
    };

    // Create 27 individual cubelets (3x3x3)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const materials: THREE.Material[] = [];

          // Right face (green)
          materials.push(
            new THREE.MeshPhongMaterial({
              color: x === 1 ? colors.right : 0x1a1a19,
              shininess: 80,
            })
          );
          // Left face (blue)
          materials.push(
            new THREE.MeshPhongMaterial({
              color: x === -1 ? colors.left : 0x1a1a19,
              shininess: 80,
            })
          );
          // Top face (red)
          materials.push(
            new THREE.MeshPhongMaterial({
              color: y === 1 ? colors.top : 0x1a1a19,
              shininess: 80,
            })
          );
          // Bottom face (orange)
          materials.push(
            new THREE.MeshPhongMaterial({
              color: y === -1 ? colors.bottom : 0x1a1a19,
              shininess: 80,
            })
          );
          // Front face (white)
          materials.push(
            new THREE.MeshPhongMaterial({
              color: z === 1 ? colors.front : 0x1a1a19,
              shininess: 80,
            })
          );
          // Back face (yellow)
          materials.push(
            new THREE.MeshPhongMaterial({
              color: z === -1 ? colors.back : 0x1a1a19,
              shininess: 80,
            })
          );

          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const cube = new THREE.Mesh(geometry, materials);

          cube.position.set(
            x * (cubeSize + gap),
            y * (cubeSize + gap),
            z * (cubeSize + gap)
          );

          // Store metadata for highlighting
          const visibleFaces =
            (x === 1 || x === -1 ? 1 : 0) +
            (y === 1 || y === -1 ? 1 : 0) +
            (z === 1 || z === -1 ? 1 : 0);

          cube.userData = {
            isCenter: visibleFaces === 1 && (x === 0 || y === 0 || z === 0),
            isEdge: visibleFaces === 2,
            isCorner: visibleFaces === 3,
            hasWhite: z === 1,
            position: { x, y, z },
          };

          // Add Rubik's logo to center front face
          if (x === 0 && y === 0 && z === 1) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // White background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, 512, 512);

              // Black text
              ctx.fillStyle = '#000000';
              ctx.font = 'italic bold 56px serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText("Rubik's", 256, 200);
              ctx.font = 'bold 64px sans-serif';
              ctx.fillText("CUBE", 256, 280);

              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              if (Array.isArray(cube.material)) {
                // Front face is index 4
                cube.material[4] = new THREE.MeshPhongMaterial({
                  map: texture,
                  shininess: 80,
                });
              }
            }
          }

          // Add black edges
          const edges = new THREE.EdgesGeometry(geometry);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
          );
          cube.add(line);

          cubeGroup.add(cube);
        }
      }
    }

    // Animation loop
    const animate = () => {
      requestIdRef.current = requestAnimationFrame(animate);

      if (!isRotating) {
        cubeGroup.rotation.y += 0.002 * rotationSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse interaction for rotation
    const handleMouseDown = (e: MouseEvent) => {
      setIsRotating(true);
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isRotating || !cubeGroup) return;

      const deltaX = e.clientX - mouseRef.current.prevX;
      const deltaY = e.clientY - mouseRef.current.prevY;

      cubeGroup.rotation.y += deltaX * 0.01;
      cubeGroup.rotation.x += deltaY * 0.01;

      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
    };

    const handleMouseUp = () => {
      setIsRotating(false);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    const container = containerRef.current;
    const rendererElement = renderer.domElement;
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      rendererElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container && rendererElement) {
        container.removeChild(rendererElement);
      }
      renderer.dispose();
    };
  }, [isRotating, rotationSpeed]);

  // Update cube based on props
  useEffect(() => {
    if (!cubeGroupRef.current) return;

    cubeGroupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData) {
        const { isCenter, isEdge, isCorner, hasWhite } = child.userData;

        let opacity = 1;
        let shouldHighlight = false;

        if (highlightCenters && isCenter) shouldHighlight = true;
        if (highlightEdges && isEdge) shouldHighlight = true;
        if (highlightCorners && isCorner) shouldHighlight = true;
        if (highlightWhites && hasWhite) shouldHighlight = true;

        if ((highlightCenters || highlightEdges || highlightCorners || highlightWhites) && !shouldHighlight) {
          opacity = 0.15;
        }

        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat instanceof THREE.MeshPhongMaterial) {
              mat.opacity = opacity;
              mat.transparent = opacity < 1;
              mat.needsUpdate = true;
            }
          });
        }

        // Also update the edge lines
        child.children.forEach((lineChild) => {
          if (lineChild instanceof THREE.LineSegments) {
            const lineMat = lineChild.material as THREE.LineBasicMaterial;
            lineMat.opacity = opacity;
            lineMat.transparent = opacity < 1;
            lineMat.needsUpdate = true;
          }
        });
      }
    });
  }, [highlightCenters, highlightEdges, highlightCorners, highlightWhites]);

  return <div ref={containerRef} className="w-full h-full" />;
}
