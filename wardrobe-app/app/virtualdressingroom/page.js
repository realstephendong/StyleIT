// app/virtualdressingroom/page.js
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import dynamic from "next/dynamic";

import Image from "next/image";
import TShirtImage from "@/../clothes/tshirt.png";

const ClothingSelector = () => {
  const clothingItems = [
    {
      id: 1,
      name: "Basic T-Shirt",
      image: TShirtImage,
      type: "top",
      anchorPoints: {
        shoulders: { left: [0.2, 0.1], right: [0.8, 0.1] },
        waist: { left: [0.2, 0.9], right: [0.8, 0.9] },
      },
    },
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {clothingItems.map((item) => (
        <div
          key={item.id}
          className="flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => onSelect(item)}
        >
          <Image
            src={item.image}
            alt={item.name}
            width={96} // w-24 in Tailwind is 96px
            height={96}
            className="object-cover rounded-lg border-2 border-gray-200"
          />
          <p className="text-sm text-center mt-1">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default function VirtualDressingRoom() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [mediaPipe, setMediaPipe] = useState(null);

  useEffect(() => {
    let holistic;
    let camera;

    const setupMediaPipe = async () => {
      try {
        // Import MediaPipe modules dynamically
        const { Holistic } = await import("@mediapipe/holistic");
        const { Camera } = await import("@mediapipe/camera_utils");
        const { drawConnectors, drawLandmarks } = await import(
          "@mediapipe/drawing_utils"
        );

        // Initialize MediaPipe Holistic
        holistic = new Holistic({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
          },
        });

        // Configure MediaPipe settings
        await holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          refineFaceLandmarks: true,
        });

        // Set up the onResults callback
        holistic.onResults((results) => {
          if (!canvasRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw camera feed
          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          }

          // Draw pose landmarks and apply clothing
          if (results.poseLandmarks) {
            // For debugging - comment out in production
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 4,
            });
            drawLandmarks(ctx, results.poseLandmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });

            if (selectedClothing) {
              // Create an offscreen canvas for processing
              const offscreen = new OffscreenCanvas(
                canvas.width,
                canvas.height
              );
              const offscreenCtx = offscreen.getContext("2d");

              // First draw the camera frame
              offscreenCtx.drawImage(
                results.image,
                0,
                0,
                canvas.width,
                canvas.height
              );

              // Then overlay clothing with alpha blending
              const blendedImage = applyClothingWithBlending(
                results.poseLandmarks,
                offscreenCtx,
                selectedClothing
              );

              // Draw final result to main canvas
              ctx.drawImage(blendedImage, 0, 0);
            }
          }
        });

        // Initialize camera
        if (!videoRef.current) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        videoRef.current.srcObject = stream;

        // Set up MediaPipe Camera
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await holistic.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();
        setIsLoading(false);
      } catch (error) {
        console.error("Error setting up MediaPipe:", error);
        setIsLoading(false);
      }
    };

    setupMediaPipe();

    // Cleanup function
    return () => {
      if (camera) {
        camera.stop();
      }
      if (holistic) {
        holistic.close();
      }
    };
  }, []);

  const applyClothingWithBlending = (poseLandmarks, ctx, clothingImage) => {
    if (!poseLandmarks || !clothingImage || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // Get key body landmarks for clothing placement
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      // Calculate clothing dimensions
      const shoulderWidth = Math.sqrt(
        Math.pow((rightShoulder.x - leftShoulder.x) * canvas.width, 2) +
          Math.pow((rightShoulder.y - leftShoulder.y) * canvas.height, 2)
      );

      const torsoHeight = Math.sqrt(
        Math.pow((leftHip.x - leftShoulder.x) * canvas.width, 2) +
          Math.pow((leftHip.y - leftShoulder.y) * canvas.height, 2)
      );

      // Create a temporary canvas for the clothing
      const tempCanvas = new OffscreenCanvas(canvas.width, canvas.height);
      const tempCtx = tempCanvas.getContext("2d");

      // Draw and transform clothing
      tempCtx.save();

      // Calculate rotation
      const angle = Math.atan2(
        rightShoulder.y - leftShoulder.y,
        rightShoulder.x - leftShoulder.x
      );

      tempCtx.translate(
        leftShoulder.x * canvas.width,
        leftShoulder.y * canvas.height
      );
      tempCtx.rotate(angle);
      tempCtx.scale(
        shoulderWidth / clothingImage.width,
        torsoHeight / clothingImage.height
      );

      tempCtx.drawImage(clothingImage, 0, 0);

      // Get image data for blending
      const clothingData = tempCtx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const backgroundData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Blend pixels
      for (let i = 0; i < clothingData.data.length; i += 4) {
        // Alpha blending formula
        const alpha = clothingData.data[i + 3] / 255;
        if (alpha > 0) {
          // Only process non-transparent pixels
          backgroundData.data[i] =
            clothingData.data[i] * alpha + backgroundData.data[i] * (1 - alpha);
          backgroundData.data[i + 1] =
            clothingData.data[i + 1] * alpha +
            backgroundData.data[i + 1] * (1 - alpha);
          backgroundData.data[i + 2] =
            clothingData.data[i + 2] * alpha +
            backgroundData.data[i + 2] * (1 - alpha);
        }
      }

      // Put the blended image back
      ctx.putImageData(backgroundData, 0, 0);
      tempCtx.restore();

      return tempCanvas;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Virtual Dressing Room
        </h1>

        <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-50">
              <div className="text-white text-lg">Loading camera...</div>
            </div>
          )}

          <video ref={videoRef} className="w-full" autoPlay playsInline />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={640}
            height={480}
          />

          {/* Camera controls */}
          <div className="absolute bottom-4 left-4 p-2 bg-white rounded-lg shadow-lg">
            <Camera className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Clothing selector */}
        <div className="mt-8">
          <ClothingSelector onSelect={setSelectedClothing} />
        </div>
      </div>
    </div>
  );
}
