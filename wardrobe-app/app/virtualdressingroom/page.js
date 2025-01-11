"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, ZoomIn, ZoomOut, Download } from "lucide-react";

const POSE_CONFIDENCE_THRESHOLD = 0.7;

// Create a cached image loader
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
  ctx,
  clothingImage,
  canvasRef,
  previousTransform
) => {
  if (!poseLandmarks || !clothingImage || !canvasRef.current) {
    return null;
  }

  const canvas = canvasRef.current;
  const leftShoulder = poseLandmarks[11];
  const rightShoulder = poseLandmarks[12];
  const leftHip = poseLandmarks[23];
  const rightHip = poseLandmarks[24];

  // Ensure all necessary landmarks are available and visible
  if (
    leftShoulder?.visibility > POSE_CONFIDENCE_THRESHOLD &&
    rightShoulder?.visibility > POSE_CONFIDENCE_THRESHOLD &&
    leftHip?.visibility > POSE_CONFIDENCE_THRESHOLD &&
    rightHip?.visibility > POSE_CONFIDENCE_THRESHOLD
  ) {
    // Calculate dimensions
    const shoulderWidth = Math.abs(
      (rightShoulder.x - leftShoulder.x) * canvas.width
    );
    const torsoHeight = Math.abs(
      ((leftHip.y + rightHip.y) / 2 - (leftShoulder.y + rightShoulder.y) / 2) *
        canvas.height
    );

    // Calculate center point between shoulders
    const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width - 7;
    const centerY = ((leftShoulder.y + rightShoulder.y) / 2) * canvas.height + 30;

    try {
      const img = await loadImage(clothingImage);

      // Calculate scaling factors
      const scaleX = (shoulderWidth / img.width) * 2.2;
      const scaleY = (torsoHeight / img.height) * 1.5;

      // Create current transform object
      const currentTransform = {
        centerX,
        centerY,
        scaleX,
        scaleY,
      };

      // Apply smoothing if previous transform exists
      const smoothedTransform = previousTransform
        ? {
            centerX:
              previousTransform.centerX * 0.8 + currentTransform.centerX * 0.2,
            centerY:
              previousTransform.centerY * 0.8 + currentTransform.centerY * 0.2,
            scaleX:
              previousTransform.scaleX * 0.8 + currentTransform.scaleX * 0.2,
            scaleY:
              previousTransform.scaleY * 0.8 + currentTransform.scaleY * 0.2,
          }
        : currentTransform;

      ctx.save();

      // Transform context using smoothed values
      ctx.translate(smoothedTransform.centerX, smoothedTransform.centerY);
      ctx.scale(smoothedTransform.scaleX, smoothedTransform.scaleY);

      // Draw image centered on shoulders
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
  return previousTransform;
};

const clothingItems = [
  {
    id: 1,
    name: "Basic T-Shirt",
    image: "https://i.imgur.com/1WXAKVi.png",
    type: "top",
  },
];

export default function VirtualDressingRoom() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const transformRef = useRef(null);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState(clothingItems[0]);
  const [clothingImage, setClothingImage] = useState(clothingItems[0].image);

  useEffect(() => {
    // Preload all clothing images
    clothingItems.forEach((item) => {
      loadImage(item.image);
    });

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

        holistic.onResults(async (results) => {
          if (!canvasRef.current) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          }

          if (results.poseLandmarks) {
            if (selectedClothing && clothingImage) {
              transformRef.current = await applyClothing(
                results.poseLandmarks,
                ctx,
                clothingImage,
                canvasRef,
                transformRef.current
              );
            }
          }
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
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
          width: 640,
          height: 480,
        });

        await camera.start();
        setIsMediaPipeReady(true);
      } catch (error) {
        console.error("Error setting up MediaPipe:", error);
        setIsMediaPipeReady(false);
        setIsCameraReady(false);
      }
    };

    setupMediaPipe();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Virtual Dressing Room
        </h1>

        <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
          {(!isMediaPipeReady || !isCameraReady) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-50">
              <div className="text-white text-lg">
                {!isMediaPipeReady
                  ? "Loading MediaPipe..."
                  : "Initializing camera..."}
              </div>
            </div>
          )}

          <video ref={videoRef} className="w-full" autoPlay playsInline />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={640}
            height={480}
          />
        </div>

        <div className="mt-8">
          <div className="flex gap-4 p-4 overflow-x-auto">
            {clothingItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => {
                  setClothingImage(item.image);
                  setSelectedClothing(item);
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-cover rounded-lg border-2 border-gray-200"
                />
                <p className="text-sm text-center mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
