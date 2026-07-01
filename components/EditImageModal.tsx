"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FiX, FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { getCroppedImg } from "@/lib/cropImage";
import FutCard from "./FutCard";

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (croppedImageBase64: string) => void;
  // Metadata fields to feed the live preview on the left
  cardData: {
    name: string;
    position: string;
    overall: number;
    attrs: any;
    gradient: [string, string];
    frameImage?: string;
  };
}

export default function EditImageModal({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  cardData,
}: EditImageModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [temporaryPreview, setTemporaryPreview] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback(
    async (_: any, currentPixels: any) => {
      setCroppedAreaPixels(currentPixels);
      try {
        // Generates live real-time preview on the left side card as you drag or zoom
        const previewUrl = await getCroppedImg(imageSrc, currentPixels);
        if (previewUrl) setTemporaryPreview(previewUrl);
      } catch (e) {
        console.error(e);
      }
    },
    [imageSrc]
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (temporaryPreview) {
      onSave(temporaryPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 text-center relative border-b border-gray-100">
          <h2 className="font-display text-2xl text-ink">Edit image</h2>
          <p className="text-xs text-ink/60 mt-0.5">Please Crop your desire part of image</p>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Workspace Dual Columns */}
        <div className="grid md:grid-cols-2 gap-8 p-8 overflow-y-auto bg-gray-50/50 flex-1">
          
          {/* Left Column: Real-Time Card Preview */}
          <div className="flex flex-col items-center justify-center bg-cream/40 rounded-2xl p-6 border border-dashed border-gray-200">
            <span className="text-[10px] bg-gold/10 text-gold font-display px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Preview Only
            </span>
            <FutCard
              name={cardData.name}
              position={cardData.position}
              overall={cardData.overall}
              attrs={cardData.attrs}
              gradient={cardData.gradient}
              frameImage={cardData.frameImage}
              photo={temporaryPreview || imageSrc} // Live updates immediately as you pan/zoom
              size={240}
              textShiftY={{ meta: 45, name: 30, stats: 5 }}
            />
          </div>

          {/* Right Column: Checkered Cropper Box */}
          <div className="flex flex-col items-center justify-center relative">
            <div 
              className="relative w-full aspect-square max-w-[360px] bg-neutral-900 rounded-2xl overflow-hidden shadow-inner border border-gray-200"
              style={{
                backgroundImage: "linear-gradient(45deg, #efefef 25%, transparent 25%), linear-gradient(-45deg, #efefef 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #efefef 75%), linear-gradient(-45deg, transparent 75%, #efefef 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
              }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
              />
            </div>

            {/* Bottom Toolbar controls */}
            <div className="flex items-center gap-4 mt-5 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
              <button onClick={() => setRotation(r => r - 90)} className="text-gray-600 hover:text-ink p-1 transition" title="Rotate Left"><FiRotateCcw size={18} /></button>
              <button onClick={() => setRotation(r => r + 90)} className="text-gray-600 hover:text-ink p-1 transition" title="Rotate Right"><FiRotateCw size={18} /></button>
              <div className="w-px h-4 bg-gray-200" />
              <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="text-gray-600 hover:text-ink p-1 transition" title="Zoom Out"><FiZoomOut size={18} /></button>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="text-gray-600 hover:text-ink p-1 transition" title="Zoom In"><FiZoomIn size={18} /></button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-emerald hover:bg-emerald/90 text-white font-display text-sm rounded-full shadow-md transition">
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  );
}