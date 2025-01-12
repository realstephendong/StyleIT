"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";

const POSE_CONFIDENCE_THRESHOLD = 0.7;
const SMOOTHING_FACTOR = 0.8;

export default function VirtualDressingRoom() {
  const clothingItems = [
    // Shirts
    {
      id: 1,
      name: "Basic White T-Shirt",
      url: "https://i.imgur.com/OvY5xxt.png",
      type: "top",
    },
    {
      id: 2,
      name: "Black T-Shirt",
      url: "https://i.imgur.com/nWBw3Zh.png",
      type: "top",
    },
    {
      id: 3,
      name: "Blue Hoodie",
      url: "https://i.imgur.com/K5UYJM3.png",
      type: "top",
    },
    // Pants
    {
      id: 4,
      name: "Blue Jeans",
      url: "https://i.imgur.com/ExddW8J.png",
      type: "bottom",
    },
    {
      id: 5,
      name: "Black Pants",
      url: "https://i.imgur.com/YD23Yw9.png",
      type: "bottom",
    },
    {
      id: 6,
      name: "Khaki Pants",
      url: "https://i.imgur.com/Hx9NxPs.png",
      type: "bottom",
    },
    // Hats
    {
      id: 7,
      name: "Black Beanie",
      url: "https://imgur.com/tn3dnbq.png",
      type: "hat",
    },
    {
      id: 8,
      name: "Red Baseball Cap",
      url: "https://i.imgur.com/PXVYbA2.png",
      type: "hat",
    },
    {
      id: 9,
      name: "Blue Bucket Hat",
      url: "https://i.imgur.com/L5R8NVF.png",
      type: "hat",
    },
  ];

  const imageCache = new Map();
const loadImage = (src) => {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Separate transform calculation logic for better organization
const calculateTransform = (currentTransform, previousTransform) => {
  if (!previousTransform) return currentTransform;
  
  return {
    centerX: previousTransform.centerX * SMOOTHING_FACTOR + currentTransform.centerX * (1 - SMOOTHING_FACTOR),
    centerY: previousTransform.centerY * SMOOTHING_FACTOR + currentTransform.centerY * (1 - SMOOTHING_FACTOR),
    scaleX: previousTransform.scaleX * SMOOTHING_FACTOR + currentTransform.scaleX * (1 - SMOOTHING_FACTOR),
    scaleY: previousTransform.scaleY * SMOOTHING_FACTOR + currentTransform.scaleY * (1 - SMOOTHING_FACTOR),
  };
};

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const transformRefs = useRef({
    top: null,
    bottom: null,
    hat: null,
  });
  const mediaStreamRef = useRef(null);
  const holisticRef = useRef(null);
  const contextRef = useRef(null);

  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    hat: null,
  });

  // Memoize clothing sections to prevent unnecessary re-renders
  const clothingSections = useMemo(() => ({
    top: clothingItems.filter(item => item.type === 'top'),
    bottom: clothingItems.filter(item => item.type === 'bottom'),
    hat: clothingItems.filter(item => item.type === 'hat'),
  }), []);

  // Optimized toggle function using single state object
  const toggleItem = useCallback((item) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.type]: prev[item.type]?.id === item.id ? null : item
    }));
  }, []);

  const applyClothing = useCallback(async (
    poseLandmarks,
    faceLandmarks,
    clothingImage,
    clothingType,
    previousTransform
  ) => {
    if (!poseLandmarks || !clothingImage || !canvasRef.current || !contextRef.current) {
      return previousTransform;
    }

    const canvas = canvasRef.current;
    const ctx = contextRef.current;

    // Continuing from previous file...

    // Optimized hat positioning logic
    if (clothingType === "hat" && faceLandmarks) {
      const foreheadTop = faceLandmarks[10];
      const leftTemple = faceLandmarks[234];
      const rightTemple = faceLandmarks[454];
      const shoulders = {
        left: poseLandmarks[11],
        right: poseLandmarks[12]
      };
      const hips = {
        left: poseLandmarks[23],
        right: poseLandmarks[24]
      };

      const landmarksVisible = [
        shoulders.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
        shoulders.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
        hips.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
        hips.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
        foreheadTop,
        leftTemple,
        rightTemple
      ].every(Boolean);

      if (landmarksVisible) {
        const headWidth = Math.abs((rightTemple.x - leftTemple.x) * canvas.width);
        const torsoHeight = Math.abs(
          ((hips.left.y + hips.right.y) / 2 - (shoulders.left.y + shoulders.right.y) / 2) * canvas.height
        );

        try {
          const img = await loadImage(clothingImage);
          const transform = calculateTransform({
            centerX: foreheadTop.x * canvas.width,
            centerY: foreheadTop.y * canvas.height - torsoHeight * 0.11,
            scaleX: (headWidth / img.width) * 1.4,
            scaleY: (headWidth / img.width) * 1.4
          }, previousTransform);

          ctx.save();
          ctx.translate(transform.centerX, transform.centerY);
          ctx.scale(transform.scaleX, transform.scaleY);
          ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
          ctx.restore();

          return transform;
        } catch (error) {
          console.error("Error applying hat:", error);
          return previousTransform;
        }
      }
    }

    // Optimized top positioning logic
    if (clothingType === "top") {
      const shoulders = {
        left: poseLandmarks[11],
        right: poseLandmarks[12]
      };
      const hips = {
        left: poseLandmarks[23],
        right: poseLandmarks[24]
      };

      const landmarksVisible = [
        shoulders.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
        shoulders.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
        hips.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
        hips.right?.visibility > POSE_CONFIDENCE_THRESHOLD
      ].every(Boolean);

      if (landmarksVisible) {
        const shoulderWidth = Math.abs((shoulders.right.x - shoulders.left.x) * canvas.width);
        const torsoHeight = Math.abs(
          ((hips.left.y + hips.right.y) / 2 - (shoulders.left.y + shoulders.right.y) / 2) * canvas.height
        );

        try {
          const img = await loadImage(clothingImage);
          const transform = calculateTransform({
            centerX: ((shoulders.left.x + shoulders.right.x) / 2) * canvas.width - 7,
            centerY: ((shoulders.left.y + shoulders.right.y) / 2) * canvas.height + torsoHeight * 0.1,
            scaleX: (shoulderWidth / img.width) * 2.2,
            scaleY: (torsoHeight / img.height) * 1.5
          }, previousTransform);

          ctx.save();
          ctx.translate(transform.centerX, transform.centerY);
          ctx.scale(transform.scaleX, transform.scaleY);
          ctx.drawImage(img, -img.width / 2, -img.height / 4, img.width, img.height);
          ctx.restore();

          return transform;
        } catch (error) {
          console.error("Error applying top:", error);
          return previousTransform;
        }
      }
    }

    // Optimized bottom positioning logic
    if (clothingType === "bottom") {
      const landmarks = {
        hips: {
          left: poseLandmarks[23],
          right: poseLandmarks[24]
        },
        knees: {
          left: poseLandmarks[25],
          right: poseLandmarks[26]
        },
        ankles: {
          left: poseLandmarks[27],
          right: poseLandmarks[28]
        },
        shoulders: {
          left: poseLandmarks[11],
          right: poseLandmarks[12]
        }
      };

      const landmarksVisible = Object.values(landmarks).every(
        pair => pair.left?.visibility > POSE_CONFIDENCE_THRESHOLD && 
               pair.right?.visibility > POSE_CONFIDENCE_THRESHOLD
      );

      if (landmarksVisible) {
        const hipWidth = Math.abs((landmarks.hips.right.x - landmarks.hips.left.x) * canvas.width);
        const legLength = Math.abs(
          ((landmarks.ankles.left.y + landmarks.ankles.right.y) / 2 - 
           (landmarks.hips.left.y + landmarks.hips.right.y) / 2) * canvas.height
        );
        const torsoHeight = Math.abs(
          ((landmarks.hips.left.y + landmarks.hips.right.y) / 2 - 
           (landmarks.shoulders.left.y + landmarks.shoulders.right.y) / 2) * canvas.height
        );

        try {
          const img = await loadImage(clothingImage);
          const transform = calculateTransform({
            centerX: ((landmarks.hips.left.x + landmarks.hips.right.x) / 2) * canvas.width,
            centerY: ((landmarks.hips.left.y + landmarks.hips.right.y) / 2) * canvas.height + torsoHeight * 0.75,
            scaleX: (hipWidth / img.width) * 2.5,
            scaleY: (legLength / img.height) * 1.35
          }, previousTransform);

          ctx.save();
          ctx.translate(transform.centerX, transform.centerY);
          ctx.scale(transform.scaleX, transform.scaleY);
          ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
          ctx.restore();

          return transform;
        } catch (error) {
          console.error("Error applying bottom:", error);
          return previousTransform;
        }
      }
    }
    return previousTransform;
  }, []);

  // Optimized MediaPipe setup with proper cleanup
  useEffect(() => {
  let holisticInstance;
  let cameraInstance;

  const setupMediaPipe = async () => {
    try {
      const { Holistic } = await import("@mediapipe/holistic");
      const { Camera } = await import("@mediapipe/camera_utils");

      holisticInstance = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
        }
      });

      // Modify the options
      await holisticInstance.initialize();
      holisticInstance.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        selfieMode: true
      });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 960, height: 720 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
          setIsCameraReady(true);
        }

        // Initialize canvas context once
        if (canvasRef.current) {
          contextRef.current = canvasRef.current.getContext('2d');
        }

        holisticInstance.onResults(async (results) => {
          if (!contextRef.current || !canvasRef.current) return;

          const ctx = contextRef.current;
          const canvas = canvasRef.current;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          }

          if (results.poseLandmarks) {
            // Apply clothing in reverse order for proper layering
            if (selectedItems.bottom) {
              transformRefs.current.bottom = await applyClothing(
                results.poseLandmarks,
                results.faceLandmarks,
                selectedItems.bottom.url,
                "bottom",
                transformRefs.current.bottom
              );
            }

            if (selectedItems.top) {
              transformRefs.current.top = await applyClothing(
                results.poseLandmarks,
                results.faceLandmarks,
                selectedItems.top.url,
                "top",
                transformRefs.current.top
              );
            }

            if (selectedItems.hat && results.faceLandmarks) {
              transformRefs.current.hat = await applyClothing(
                results.poseLandmarks,
                results.faceLandmarks,
                selectedItems.hat.url,
                "hat",
                transformRefs.current.hat
              );
            }
          }
        });

        cameraInstance = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await holisticInstance.send({ image: videoRef.current });
            }
          },
          width: 960,
          height: 720,
        });

        await cameraInstance.start();
        setIsMediaPipeReady(true);
      } catch (error) {
        console.error("Error in MediaPipe setup:", error);
        setIsMediaPipeReady(false);
        setIsCameraReady(false);
      }
    };

    setupMediaPipe();

    // Cleanup function
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (holisticInstance) {
        holisticInstance.close();
      }
      if (cameraInstance) {
        cameraInstance.stop();
      }
    };
  }, [applyClothing, selectedItems]);

  // Memoized clothing section renderer
  const ClothingSection = useCallback(({ type, title, items }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedItems[type]?.id === item.id
                ? "ring-4 ring-blue-500 scale-105"
                : "hover:scale-105"
            }`}
            onClick={() => toggleItem(item)}
          >
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-32 object-contain mb-2"
                loading="lazy"
              />
              <p className="text-center text-sm font-medium">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ), [selectedItems, toggleItem]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Virtual Dressing Room
        </h1>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-lg">
              {(!isMediaPipeReady || !isCameraReady) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-50">
                  <div className="text-white text-lg">
                    {!isMediaPipeReady
                      ? "Loading MediaPipe..."
                      : "Initializing camera..."}
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full"
                autoPlay
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                width={960}
                height={720}
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <ClothingSection type="top" title="Tops" items={clothingSections.top} />
            <ClothingSection type="bottom" title="Bottoms" items={clothingSections.bottom} />
            <ClothingSection type="hat" title="Hats" items={clothingSections.hat} />
          </div>
        </div>
      </div>
    </div>
  );
}
