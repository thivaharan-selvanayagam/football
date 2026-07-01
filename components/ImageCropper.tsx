// components/ImageCropper.tsx
"use client"; // Required since react-easy-crop uses browser events

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: { x: number; y: number; width: number; height: number }) => void;
}

export default function ImageCropper({ imageSrc, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropChange = (crop: { x: number; y: number }) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropAreaComplete = useCallback((_: any, croppedAreaPixels: any) => {
    onCropComplete(croppedAreaPixels);
  }, [onCropComplete]);

  return (
    <div className="relative w-full h-64 bg-neutral-900 rounded-xl overflow-hidden border border-black/10">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1} 
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropAreaComplete}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 z-10">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-emerald"
        />
      </div>
    </div>
  );
}