'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ZoomIn, ZoomOut, Download } from 'lucide-react';

const POSE_CONNECTIONS = [
  [11, 12], // Left shoulder to right shoulder
  [11, 23], // Left shoulder to left hip
  [12, 24], // Right shoulder to right hip
  [23, 24], // Left hip to right hip
];

const POSE_CONFIDENCE_THRESHOLD = 0.7;

const ClothingSelector = ({ onSelect }) => {
  const clothingItems = [
    {
      id: 1,
      name: 'Basic T-Shirt',
      image: "https://i.imgur.com/1WXAKVi.png",
      type: 'top',
      anchorPoints: {
        shoulders: { left: [0.2, 0.1], right: [0.8, 0.1] },
        waist: { left: [0.2, 0.9], right: [0.8, 0.9] }
      }
    }
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {clothingItems.map((item) => (
        <div
          key={item.id}
          className="flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => onSelect(item)}
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
  );
};

const blendPixels = (clothingData, backgroundData, width, height) => {
  const imageData = new ImageData(width, height);
  for (let i = 0; i < clothingData.data.length; i += 4) {
    const alpha = clothingData.data[i + 3] / 255;
    if (alpha > 0.1) {
      imageData.data[i] = clothingData.data[i] * alpha + backgroundData.data[i] * (1 - alpha);
      imageData.data[i + 1] = clothingData.data[i + 1] * alpha + backgroundData.data[i + 1] * (1 - alpha);
      imageData.data[i + 2] = clothingData.data[i + 2] * alpha + backgroundData.data[i + 2] * (1 - alpha);
      imageData.data[i + 3] = 255;
    } else {
      imageData.data[i] = backgroundData.data[i];
      imageData.data[i + 1] = backgroundData.data[i + 1];
      imageData.data[i + 2] = backgroundData.data[i + 2];
      imageData.data[i + 3] = backgroundData.data[i + 3];
    }
  }
  return imageData;
};

export default function VirtualDressingRoom() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (selectedClothing) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setClothingImage(img);
        setImageError(false);
      };
      img.onerror = () => setImageError(true);
      img.src = selectedClothing.image;
    }
  }, [selectedClothing]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (canvasRef.current) {
          const { width, height } = entry.contentRect;
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      }
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const applyClothingWithBlending = (poseLandmarks, ctx, clothingImage) => {
    if (!poseLandmarks || !clothingImage || !canvasRef.current) {
      console.log('Missing required data for blending:', {
        hasPoseLandmarks: !!poseLandmarks,
        hasClothingImage: !!clothingImage,
        hasCanvas: !!canvasRef.current
      });
      return;
    }

    const canvas = canvasRef.current;
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      try {
        const tempCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        const tempCtx = tempCanvas.getContext('2d');
        
        const shoulderWidth = Math.sqrt(
          Math.pow((rightShoulder.x - leftShoulder.x) * canvas.width, 2) +
          Math.pow((rightShoulder.y - leftShoulder.y) * canvas.height, 2)
        );
        
        const torsoHeight = Math.sqrt(
          Math.pow((leftHip.x - leftShoulder.x) * canvas.width, 2) +
          Math.pow((leftHip.y - leftShoulder.y) * canvas.height, 2)
        );

        tempCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        tempCtx.save();
        tempCtx.translate(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height);
        
        const angle = Math.atan2(
          rightShoulder.y - leftShoulder.y,
          rightShoulder.x - leftShoulder.x
        );
        tempCtx.rotate(angle);
        
        const scaleX = (shoulderWidth / clothingImage.width) * scale;
        const scaleY = (torsoHeight / clothingImage.height) * scale;
        tempCtx.scale(scaleX, scaleY);
        
        tempCtx.drawImage(clothingImage, 0, 0);
        tempCtx.restore();
        
        const clothingData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const backgroundData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const blendedImageData = blendPixels(
          clothingData, 
          backgroundData, 
          canvas.width,
          canvas.height
        );
        
        ctx.putImageData(blendedImageData, 0, 0);
        
        return tempCanvas;
      } catch (error) {
        console.error('Error during clothing blending:', error);
      }
    } else {
      console.log('Missing required landmarks for blending');
    }
  };

  useEffect(() => {
    let holistic;
    let camera;

    const setupMediaPipe = async () => {
      console.log('Starting MediaPipe setup...');
      try {
        console.log('Importing MediaPipe modules...');
        const { Holistic } = await import('@mediapipe/holistic');
        const { Camera } = await import('@mediapipe/camera_utils');
        const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');

        holistic = new Holistic({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
          }
        });

        await holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          refineFaceLandmarks: true
        });

        holistic.onResults((results) => {
          if (!canvasRef.current) return;
          
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          }

          if (results.poseLandmarks && 
              results.poseLandmarks[11].visibility > POSE_CONFIDENCE_THRESHOLD &&
              results.poseLandmarks[12].visibility > POSE_CONFIDENCE_THRESHOLD) {
            
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, 
              { color: '#00FF00', lineWidth: 4 });
            drawLandmarks(ctx, results.poseLandmarks,
              { color: '#FF0000', lineWidth: 2 });
            
            if (selectedClothing && clothingImage) {
              const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
              const offscreenCtx = offscreen.getContext('2d');
              
              offscreenCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
              
              const blendedImage = applyClothingWithBlending(
                results.poseLandmarks, 
                offscreenCtx,
                clothingImage
              );
              
              if (blendedImage) {
                ctx.drawImage(blendedImage, 0, 0);
              }
            }
          }
        });

        console.log('Initializing camera...');
        if (!videoRef.current) {
          console.error('Video ref not found');
          return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);

        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await holistic.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        setIsMediaPipeReady(true);

      } catch (error) {
        console.error('Error setting up MediaPipe:', error);
        setIsMediaPipeReady(false);
        setIsCameraReady(false);
      }
    };

    setupMediaPipe();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (holistic) {
        holistic.close();
      }
    };
  }, []);

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'virtual-fitting-room.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Virtual Dressing Room</h1>
        
        <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
          {(!isMediaPipeReady || !isCameraReady) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-50">
              <div className="text-white text-lg">
                {!isMediaPipeReady ? "Loading MediaPipe..." : "Initializing camera..."}
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width={640}
            height={480}
          />
          
          <div className="absolute bottom-4 left-4 p-2 bg-white rounded-lg shadow-lg flex gap-2">
            <Camera className="w-6 h-6 text-gray-600" />
            <button 
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ZoomOut className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={() => setScale(prev => Math.min(1.5, prev + 0.1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ZoomIn className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={takeScreenshot}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Download className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <ClothingSelector onSelect={(clothing) => {
            console.log('Selected clothing:', clothing);
            setSelectedClothing(clothing);
          }} />
        </div>
        
        {imageError && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            Error loading clothing image. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}