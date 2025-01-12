"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useClothing } from "@/contexts/clothing";
import Footer from "../components/Footer";

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
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          selfieMode: false,
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 960, height: 640 },
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
          height: 640,
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
      <div className="my-4">
        <h2 className="text-xl font-semibold my-2 mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-4 w-full px-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`cursor-pointer transition-all flex-shrink-0 w-[280px] duration-200 relative flex flex-col bg-[#f5f5f7] shadow-lg transform hover:scale-105 rounded-lg overflow-hidden ${
                selectedItems[type]?._id === item._id
                  ? "ring-4 ring-blue-500 scale-105 rounded-lg"
                  : "hover:scale-105"
              }`}
              onClick={() => toggleItem(item)}
            >
              <div className="h-64 flex items-center justify-center p-2">
                <img
                  src={item.url}
                  alt={item.brand}
                  className="max-h-full max-w-full object-contain p-4"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover/item:bg-opacity-50 transition-opacity duration-300 bg-[#ffffff]">
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-white">
                        {item.brand}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-white">
                <h3 className="font-bold text-gray-900">{item.brand}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-600 text-sm">{item.type}</p>
                  <p className="font-semibold text-gray-900">${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    [selectedItems, toggleItem]
  );

  return (
    <>
      <div className="min-h-screen bg-white py-8 w-full">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Virtual Dressing Room
          </h1>

          <div className="grid w-7/8 mx-auto gap-8">
            <div className="md:col-span-8">
              <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-lg">
                {(!isMediaPipeReady || !isCameraReady) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-30">
                    <div className="text-white text-2xl font-black">
                      {!isMediaPipeReady
                        ? "Select some clothes below!"
                        : "Initializing camera..."}
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="w-full h-full my-4"
                  autoPlay
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                  width={960}
                  height={640}
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-4 space-y-6 mx-auto p-4 my-4">
            <ClothingSection type="Tops" title="Tops" items={tops} />
            <ClothingSection type="Pants" title="Bottoms" items={pants} />
            <ClothingSection type="Hat" title="Hats" items={hats} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
