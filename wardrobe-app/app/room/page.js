"use client";

import React, { useEffect, useRef, useState } from "react";

const POSE_CONFIDENCE_THRESHOLD = 0.7;

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

  // Rest of the image loading and clothing application logic remains the same
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

  const applyClothing = async (
    poseLandmarks,
    faceLandmarks,
    ctx,
    clothingImage,
    clothingType,
    canvasRef,
    previousTransform
  ) => {
    if (!poseLandmarks || !clothingImage || !canvasRef.current) {
      return null;
    }

    const canvas = canvasRef.current;

    if (clothingType === "hat" && faceLandmarks) {
      // Use face landmarks for hat positioning
      const foreheadTop = faceLandmarks[10]; // Top of forehead
      const leftTemple = faceLandmarks[234]; // Left temple
      const rightTemple = faceLandmarks[454]; // Right temple

      // Get torso landmarks for scaling reference
      const leftShoulder = poseLandmarks[11];
      const rightShoulder = poseLandmarks[12];
      const leftHip = poseLandmarks[23];
      const rightHip = poseLandmarks[24];

      if (
        foreheadTop &&
        leftTemple &&
        rightTemple &&
        leftShoulder?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightShoulder?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        leftHip?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightHip?.visibility > POSE_CONFIDENCE_THRESHOLD
      ) {
        const headWidth = Math.abs(
          (rightTemple.x - leftTemple.x) * canvas.width
        );

        // Calculate torso height for relative scaling
        const torsoHeight = Math.abs(
          ((leftHip.y + rightHip.y) / 2 -
            (leftShoulder.y + rightShoulder.y) / 2) *
            canvas.height
        );

        // Calculate vertical offset based on torso height
        const verticalOffset = torsoHeight * 0.11; // Adjust this multiplier to fine-tune the positioning

        // Position above the forehead with dynamic offset
        const centerX = foreheadTop.x * canvas.width;
        const centerY = foreheadTop.y * canvas.height - verticalOffset;

        try {
          const img = await loadImage(clothingImage);

          // Scale based on head width
          const scaleX = (headWidth / img.width) * 1.4;
          const scaleY = (headWidth / img.width) * 1.4; // Maintain aspect ratio

          const currentTransform = {
            centerX,
            centerY,
            scaleX,
            scaleY,
          };

          const smoothedTransform = previousTransform
            ? {
                centerX:
                  previousTransform.centerX * 0.8 +
                  currentTransform.centerX * 0.2,
                centerY:
                  previousTransform.centerY * 0.8 +
                  currentTransform.centerY * 0.2,
                scaleX:
                  previousTransform.scaleX * 0.8 +
                  currentTransform.scaleX * 0.2,
                scaleY:
                  previousTransform.scaleY * 0.8 +
                  currentTransform.scaleY * 0.2,
              }
            : currentTransform;

          ctx.save();
          ctx.translate(smoothedTransform.centerX, smoothedTransform.centerY);
          ctx.scale(smoothedTransform.scaleX, smoothedTransform.scaleY);
          ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
          );
          ctx.restore();

          return smoothedTransform;
        } catch (error) {
          console.error("Error loading or drawing hat image:", error);
          return previousTransform;
        }
      }
    } else if (clothingType === "top") {
      const leftShoulder = poseLandmarks[11];
      const rightShoulder = poseLandmarks[12];
      const leftHip = poseLandmarks[23];
      const rightHip = poseLandmarks[24];

      if (
        leftShoulder?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightShoulder?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        leftHip?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightHip?.visibility > POSE_CONFIDENCE_THRESHOLD
      ) {
        const shoulderWidth = Math.abs(
          (rightShoulder.x - leftShoulder.x) * canvas.width
        );
        const torsoHeight = Math.abs(
          ((leftHip.y + rightHip.y) / 2 -
            (leftShoulder.y + rightShoulder.y) / 2) *
            canvas.height
        );

        const verticalOffset = torsoHeight * 0.1;

        const centerX =
          ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width - 7;
        const centerY =
          ((leftShoulder.y + rightShoulder.y) / 2) * canvas.height +
          verticalOffset;

        try {
          const img = await loadImage(clothingImage);

          const scaleX = (shoulderWidth / img.width) * 2.2;
          const scaleY = (torsoHeight / img.height) * 1.5;

          const currentTransform = {
            centerX,
            centerY,
            scaleX,
            scaleY,
          };

          const smoothedTransform = previousTransform
            ? {
                centerX:
                  previousTransform.centerX * 0.8 +
                  currentTransform.centerX * 0.2,
                centerY:
                  previousTransform.centerY * 0.8 +
                  currentTransform.centerY * 0.2,
                scaleX:
                  previousTransform.scaleX * 0.8 +
                  currentTransform.scaleX * 0.2,
                scaleY:
                  previousTransform.scaleY * 0.8 +
                  currentTransform.scaleY * 0.2,
              }
            : currentTransform;

          ctx.save();
          ctx.translate(smoothedTransform.centerX, smoothedTransform.centerY);
          ctx.scale(smoothedTransform.scaleX, smoothedTransform.scaleY);
          ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 4,
            img.width,
            img.height
          );
          ctx.restore();

          return smoothedTransform;
        } catch (error) {
          console.error("Error loading or drawing clothing image:", error);
          return previousTransform;
        }
      }
    } else if (clothingType === "bottom") {
      const leftHip = poseLandmarks[23];
      const rightHip = poseLandmarks[24];
      const leftKnee = poseLandmarks[25];
      const rightKnee = poseLandmarks[26];
      const leftAnkle = poseLandmarks[27];
      const rightAnkle = poseLandmarks[28];
      const leftShoulder = poseLandmarks[11];
      const rightShoulder = poseLandmarks[12];

      if (
        leftHip?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightHip?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        leftKnee?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightKnee?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        leftAnkle?.visibility > POSE_CONFIDENCE_THRESHOLD &&
        rightAnkle?.visibility > POSE_CONFIDENCE_THRESHOLD
      ) {
        const hipWidth = Math.abs((rightHip.x - leftHip.x) * canvas.width);
        const legLength = Math.abs(
          ((leftAnkle.y + rightAnkle.y) / 2 - (leftHip.y + rightHip.y) / 2) *
            canvas.height
        );
        const torsoHeight = Math.abs(
          ((leftHip.y + rightHip.y) / 2 -
            (leftShoulder.y + rightShoulder.y) / 2) *
            canvas.height
        );

        const verticalOffset = torsoHeight * 0.75;

        const centerX = ((leftHip.x + rightHip.x) / 2) * canvas.width;
        const centerY =
          ((leftHip.y + rightHip.y) / 2) * canvas.height + verticalOffset;

        try {
          const img = await loadImage(clothingImage);

          const scaleX = (hipWidth / img.width) * 2.5;
          const scaleY = (legLength / img.height) * 1.35;

          const currentTransform = {
            centerX,
            centerY,
            scaleX,
            scaleY,
          };

          const smoothedTransform = previousTransform
            ? {
                centerX:
                  previousTransform.centerX * 0.8 +
                  currentTransform.centerX * 0.2,
                centerY:
                  previousTransform.centerY * 0.8 +
                  currentTransform.centerY * 0.2,
                scaleX:
                  previousTransform.scaleX * 0.8 +
                  currentTransform.scaleX * 0.2,
                scaleY:
                  previousTransform.scaleY * 0.8 +
                  currentTransform.scaleY * 0.2,
              }
            : currentTransform;

          ctx.save();
          ctx.translate(smoothedTransform.centerX, smoothedTransform.centerY);
          ctx.scale(smoothedTransform.scaleX, smoothedTransform.scaleY);
          ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
          );
          ctx.restore();

          return smoothedTransform;
        } catch (error) {
          console.error("Error loading or drawing pants image:", error);
          return previousTransform;
        }
      }
    }
    return previousTransform;
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const topTransformRef = useRef(null);
  const bottomTransformRef = useRef(null);
  const hatTransformRef = useRef(null);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedHat, setSelectedHat] = useState(null);

  // Handle item selection/deselection
  const toggleItem = (item) => {
    switch (item.type) {
      case "top":
        setSelectedTop(selectedTop?.id === item.id ? null : item);
        break;
      case "bottom":
        setSelectedBottom(selectedBottom?.id === item.id ? null : item);
        break;
      case "hat":
        setSelectedHat(selectedHat?.id === item.id ? null : item);
        break;
    }
  };

  // Preload images on mount
  useEffect(() => {
    clothingItems.forEach((item) => {
      loadImage(item.url);
    });
  }, []);

  // Memoize the holistic callback to prevent unnecessary re-renders
  const onHolisticResults = React.useCallback(
    async (results) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.image) {
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }

      if (results.poseLandmarks) {
        if (selectedBottom) {
          bottomTransformRef.current = await applyClothing(
            results.poseLandmarks,
            results.faceLandmarks,
            ctx,
            selectedBottom.url,
            "bottom",
            canvasRef,
            bottomTransformRef.current
          );
        }

        if (selectedTop) {
          topTransformRef.current = await applyClothing(
            results.poseLandmarks,
            results.faceLandmarks,
            ctx,
            selectedTop.url,
            "top",
            canvasRef,
            topTransformRef.current
          );
        }

        if (selectedHat && results.faceLandmarks) {
          hatTransformRef.current = await applyClothing(
            results.poseLandmarks,
            results.faceLandmarks,
            ctx,
            selectedHat.url,
            "hat",
            canvasRef,
            hatTransformRef.current
          );
        }
      }
    },
    [selectedTop, selectedBottom, selectedHat]
  );

  // Setup MediaPipe once and update only the callback
  useEffect(() => {
    const setupMediaPipe = async () => {
      console.log("Starting MediaPipe setup...");
      try {
        const { Holistic } = await import("@mediapipe/holistic");
        const { Camera } = await import("@mediapipe/camera_utils");

        const holistic = new Holistic({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });

        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          refineFaceLandmarks: true,
        });

        holistic.onResults(async (results) => {});

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 960, height: 720 },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        setIsCameraReady(true);

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await holistic.send({ image: videoRef.current });
            }
          },
          width: 960,
          height: 720,
        });

        await camera.start();
        setIsMediaPipeReady(true);
      } catch (error) {
        console.error("Error setting up MediaPipe:", error);
        setIsMediaPipeReady(false);
        setIsCameraReady(false);
      }
    };

    let holisticInstance;
    setupMediaPipe().then((instance) => {
      holisticInstance = instance;
    });

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (holisticInstance) {
        holisticInstance.close();
      }
    };
  }, []); // Only run setup once

  const renderClothingSection = (type, title, selectedItem, items) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          .filter((item) => item.type === type)
          .map((item) => (
            <div
              key={item.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedItem?.id === item.id
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
                />
                <p className="text-center text-sm font-medium">{item.name}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

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
            {renderClothingSection("top", "Tops", selectedTop, clothingItems)}
            {renderClothingSection(
              "bottom",
              "Bottoms",
              selectedBottom,
              clothingItems
            )}
            {renderClothingSection("hat", "Hats", selectedHat, clothingItems)}
          </div>
        </div>
      </div>
    </div>
  );
}
