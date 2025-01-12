"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useClothing } from "@/contexts/clothing";

const POSE_CONFIDENCE_THRESHOLD = 0.7;
const SMOOTHING_FACTOR = 0.8;

export default function VirtualDressingRoom() {
  const { tops, pants, hats } = useClothing();

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

  const calculateRotations = {
    hat: (faceLandmarks) => {
      const leftEye = faceLandmarks[33];
      const rightEye = faceLandmarks[263];
      return Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    },
  };

  // Separate transform calculation logic for better organization
  const calculateTransform = (currentTransform, previousTransform) => {
    if (!previousTransform) return currentTransform;

    const smoothRotation =
      previousTransform.rotation !== undefined
        ? previousTransform.rotation * SMOOTHING_FACTOR +
          currentTransform.rotation * (1 - SMOOTHING_FACTOR)
        : currentTransform.rotation;

    return {
      centerX:
        previousTransform.centerX * SMOOTHING_FACTOR +
        currentTransform.centerX * (1 - SMOOTHING_FACTOR),
      centerY:
        previousTransform.centerY * SMOOTHING_FACTOR +
        currentTransform.centerY * (1 - SMOOTHING_FACTOR),
      scaleX:
        previousTransform.scaleX * SMOOTHING_FACTOR +
        currentTransform.scaleX * (1 - SMOOTHING_FACTOR),
      scaleY:
        previousTransform.scaleY * SMOOTHING_FACTOR +
        currentTransform.scaleY * (1 - SMOOTHING_FACTOR),
      rotation: smoothRotation,
    };
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const transformRefs = useRef({
    Tops: null,
    Pants: null,
    Hat: null,
  });
  const mediaStreamRef = useRef(null);
  const holisticRef = useRef(null);
  const contextRef = useRef(null);

  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    Tops: null,
    Pants: null,
    Hat: null,
  });


  // Optimized toggle function using single state object
  const toggleItem = useCallback((item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item.type]: prev[item.type]?._id === item._id ? null : item,
    }));
  }, []);

  const applyClothing = useCallback(
    async (
      poseLandmarks,
      faceLandmarks,
      clothingImage,
      clothingType,
      previousTransform
    ) => {
      if (
        !poseLandmarks ||
        !clothingImage ||
        !canvasRef.current ||
        !contextRef.current
      ) {
        return previousTransform;
      }

      const canvas = canvasRef.current;
      const ctx = contextRef.current;

      if (clothingType === "Hat" && faceLandmarks) {
        const foreheadTop = faceLandmarks[10];
        const leftTemple = faceLandmarks[234];
        const rightTemple = faceLandmarks[454];
        const shoulders = {
          left: poseLandmarks[11],
          right: poseLandmarks[12],
        };
        const hips = {
          left: poseLandmarks[23],
          right: poseLandmarks[24],
        };

        const landmarksVisible = [
          shoulders.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
          shoulders.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
          hips.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
          hips.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
          foreheadTop,
          leftTemple,
          rightTemple,
        ].every(Boolean);

        if (landmarksVisible) {
          const headWidth = Math.abs(
            (rightTemple.x - leftTemple.x) * canvas.width
          );
          const torsoHeight = Math.abs(
            ((hips.left.y + hips.right.y) / 2 -
              (shoulders.left.y + shoulders.right.y) / 2) *
              canvas.height
          );

          try {
            const img = await loadImage(clothingImage);
            const hatRotation = calculateRotations.hat(faceLandmarks);
            const transform = calculateTransform(
              {
                centerX: foreheadTop.x * canvas.width,
                centerY: foreheadTop.y * canvas.height - torsoHeight * 0.11,
                scaleX: (headWidth / img.width) * 1.4,
                scaleY: (headWidth / img.width) * 1.4,
                rotation: hatRotation,
              },
              previousTransform
            );

            ctx.save();
            ctx.translate(transform.centerX, transform.centerY);
            if (transform.rotation) {
              ctx.rotate(transform.rotation);
            }
            ctx.scale(transform.scaleX, transform.scaleY);
            ctx.drawImage(
              img,
              -img.width / 2,
              -img.height / 2,
              img.width,
              img.height
            );
            ctx.restore();

            return transform;
          } catch (error) {
            console.error("Error applying hat:", error);
            return previousTransform;
          }
        }
      }

      // Optimized top positioning logic
      if (clothingType === "Tops") {
        const shoulders = {
          left: poseLandmarks[11],
          right: poseLandmarks[12],
        };
        const hips = {
          left: poseLandmarks[23],
          right: poseLandmarks[24],
        };

        const landmarksVisible = [
          shoulders.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
          shoulders.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
          hips.left?.visibility > POSE_CONFIDENCE_THRESHOLD,
          hips.right?.visibility > POSE_CONFIDENCE_THRESHOLD,
        ].every(Boolean);

        if (landmarksVisible) {
          const shoulderWidth = Math.abs(
            (shoulders.right.x - shoulders.left.x) * canvas.width
          );
          const torsoHeight = Math.abs(
            ((hips.left.y + hips.right.y) / 2 -
              (shoulders.left.y + shoulders.right.y) / 2) *
              canvas.height
          );

          try {
            const img = await loadImage(clothingImage);
            const transform = calculateTransform(
              {
                centerX:
                  ((shoulders.left.x + shoulders.right.x) / 2) * canvas.width -
                  7,
                centerY:
                  ((shoulders.left.y + shoulders.right.y) / 2) * canvas.height +
                  torsoHeight * 0.1,
                scaleX: (shoulderWidth / img.width) * 2.2,
                scaleY: (torsoHeight / img.height) * 1.5,
              },
              previousTransform
            );

            ctx.save();
            ctx.translate(transform.centerX, transform.centerY);
            ctx.scale(transform.scaleX, transform.scaleY);
            ctx.drawImage(
              img,
              -img.width / 2,
              -img.height / 4,
              img.width,
              img.height
            );
            ctx.restore();

            return transform;
          } catch (error) {
            console.error("Error applying top:", error);
            return previousTransform;
          }
        }
      }

      // Optimized bottom positioning logic
      if (clothingType === "Pants") {
        const landmarks = {
          hips: {
            left: poseLandmarks[23],
            right: poseLandmarks[24],
          },
          knees: {
            left: poseLandmarks[25],
            right: poseLandmarks[26],
          },
          ankles: {
            left: poseLandmarks[27],
            right: poseLandmarks[28],
          },
          shoulders: {
            left: poseLandmarks[11],
            right: poseLandmarks[12],
          },
        };

        const landmarksVisible = Object.values(landmarks).every(
          (pair) =>
            pair.left?.visibility > POSE_CONFIDENCE_THRESHOLD &&
            pair.right?.visibility > POSE_CONFIDENCE_THRESHOLD
        );

        if (landmarksVisible) {
          const hipWidth = Math.abs(
            (landmarks.hips.right.x - landmarks.hips.left.x) * canvas.width
          );
          const legLength = Math.abs(
            ((landmarks.ankles.left.y + landmarks.ankles.right.y) / 2 -
              (landmarks.hips.left.y + landmarks.hips.right.y) / 2) *
              canvas.height
          );
          const torsoHeight = Math.abs(
            ((landmarks.hips.left.y + landmarks.hips.right.y) / 2 -
              (landmarks.shoulders.left.y + landmarks.shoulders.right.y) / 2) *
              canvas.height
          );

          try {
            const img = await loadImage(clothingImage);
            const transform = calculateTransform(
              {
                centerX:
                  ((landmarks.hips.left.x + landmarks.hips.right.x) / 2) *
                  canvas.width,
                centerY:
                  ((landmarks.hips.left.y + landmarks.hips.right.y) / 2) *
                    canvas.height +
                  torsoHeight * 0.75,
                scaleX: (hipWidth / img.width) * 2.5,
                scaleY: (legLength / img.height) * 1.35,
              },
              previousTransform
            );

            ctx.save();
            ctx.translate(transform.centerX, transform.centerY);
            ctx.scale(transform.scaleX, transform.scaleY);
            ctx.drawImage(
              img,
              -img.width / 2,
              -img.height / 2,
              img.width,
              img.height
            );
            ctx.restore();

            return transform;
          } catch (error) {
            console.error("Error applying bottom:", error);
            return previousTransform;
          }
        }
      }
      return previousTransform;
    },
    []
  );

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
          },
        });

        // Modify the options
        await holisticInstance.initialize();
        holisticInstance.setOptions({
          modelComplexity: 0,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          selfieMode: true,
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
          contextRef.current = canvasRef.current.getContext("2d");
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
            if (selectedItems.Tops) {
              transformRefs.current.Tops = await applyClothing(
                results.poseLandmarks,
                results.faceLandmarks,
                selectedItems.Tops.url,
                "Tops",
                transformRefs.current.Tops
              );
            }

            if (selectedItems.Pants) {
              transformRefs.current.Pants = await applyClothing(
                results.poseLandmarks,
                results.faceLandmarks,
                selectedItems.Pants.url,
                "Pants",
                transformRefs.current.Pants
              );
            }

            if (selectedItems.Hat && results.faceLandmarks) {
              transformRefs.current.Hat = await applyClothing(
                results.poseLandmarks,
                results.faceLandmarks,
                selectedItems.Hat.url,
                "Hat",
                transformRefs.current.Hat
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
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
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
  const ClothingSection = useCallback(
    ({ type, title, items }) => (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedItems[type]?._id === item._id
                  ? "ring-4 ring-blue-500 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => toggleItem(item)}
            >
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={item.url}
                  alt={item.brand}
                  className="w-full h-32 object-contain mb-2"
                  loading="lazy"
                />
                <p className="text-center text-sm font-medium">{item.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    [selectedItems, toggleItem]
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
            <ClothingSection type="Tops" title="Tops" items={tops} />
            <ClothingSection type="Pants" title="Bottoms" items={pants} />
            <ClothingSection type="Hat" title="Hats" items={hats} />
          </div>
        </div>
      </div>
    </div>
  );
}
