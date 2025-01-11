"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Delaunay } from "d3-delaunay"; // Import Delaunay from d3

const POSE_CONFIDENCE_THRESHOLD = 0.7;

const applyClothingWithDelaunay = (
  poseLandmarks,
  ctx,
  clothingImage,
  canvasRef
) => {
  if (
    !poseLandmarks ||
    !clothingImage ||
    !canvasRef.current ||
    poseLandmarks.length < 24
  ) {
    console.log("Missing required data for warping:", {
      hasPoseLandmarks: !!poseLandmarks,
      hasClothingImage: !!clothingImage,
      hasCanvas: !!canvasRef.current,
    });
    return;
  }

  const canvas = canvasRef.current;
  const leftShoulder = poseLandmarks[11];
  const rightShoulder = poseLandmarks[12];
  const leftHip = poseLandmarks[23];
  const rightHip = poseLandmarks[24];

  if (leftShoulder && rightShoulder && leftHip && rightHip) {
    const points = [
      [leftShoulder.x * canvas.width, leftShoulder.y * canvas.height],
      [rightShoulder.x * canvas.width, rightShoulder.y * canvas.height],
      [leftHip.x * canvas.width, leftHip.y * canvas.height],
      [rightHip.x * canvas.width, rightHip.y * canvas.height],
    ];

    const delaunay = Delaunay.from(points);
    const triangles = delaunay.triangles;

    // Create an Image object
    const img = new Image();
    img.src = clothingImage; // clothingImage is the URL of the image
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;

      // Loop through triangles and apply mesh warping
      ctx.save();

      // Draw each triangle separately
      for (let i = 0; i < triangles.length; i += 3) {
        const [p1, p2, p3] = [triangles[i], triangles[i + 1], triangles[i + 2]];
        const [x1, y1] = points[p1];
        const [x2, y2] = points[p2];
        const [x3, y3] = points[p3];

        // Calculate the bounding box of the clothing image
        const clothingWidth = Math.abs(x1 - x2);
        const clothingHeight = Math.abs(y1 - y3);

        // Use the bounding box and the triangle to map the image
        const clothingImg = new Image();
        clothingImg.src = clothingImage;
        clothingImg.onload = () => {
          // Transform the image to the coordinates of the triangle
          ctx.setTransform(
            (x2 - x1) / imgWidth, // Scale X
            (y2 - y1) / imgHeight, // Scale Y
            (x3 - x1) / imgWidth, // Skew X
            (y3 - y1) / imgHeight, // Skew Y
            x1,
            y1 // Translate
          );

          // Draw the image with transformed coordinates
          ctx.drawImage(clothingImg, 0, 0, imgWidth, imgHeight);
        };
      }

      ctx.restore();
    };
  }
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
  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState(clothingItems[0]);
  const [clothingImage, setClothingImage] = useState(clothingItems[0].image);
  const [holisticResults, setHolisticResults] = useState(null);

  useEffect(() => {
    const setupMediaPipe = async () => {
      console.log("Starting MediaPipe setup...");
      try {
        const { Holistic } = await import("@mediapipe/holistic");
        const { Camera } = await import("@mediapipe/camera_utils");
        const { drawConnectors, drawLandmarks } = await import(
          "@mediapipe/drawing_utils"
        );

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

        holistic.onResults((results) => {
          if (!canvasRef.current) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setHolisticResults(results);

          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          }

          if (
            results.poseLandmarks &&
            results.poseLandmarks[11].visibility > POSE_CONFIDENCE_THRESHOLD &&
            results.poseLandmarks[12].visibility > POSE_CONFIDENCE_THRESHOLD
          ) {
            // drawConnectors(
            //   ctx,
            //   results.poseLandmarks,
            //   [
            //     [11, 12],
            //     [11, 23],
            //     [12, 24],
            //     [23, 24],
            //   ],
            //   {
            //     color: "#00FF00",
            //     lineWidth: 4,
            //   }
            // );
            // drawLandmarks(ctx, results.poseLandmarks, {
            //   color: "#FF0000",
            //   lineWidth: 2,
            // });

            if (selectedClothing && clothingImage) {
              applyClothingWithDelaunay(
                results.poseLandmarks,
                ctx,
                clothingImage,
                canvasRef
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
                  console.log("working");
                  console.log(clothingImage);
                  setClothingImage(clothingItems[0]);
                  setSelectedClothing(clothingItems[0]);
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
