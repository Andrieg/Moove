"use client";

import { useCallback, useState } from "react";
import { uploadFile, isValidImageFile, isValidVideoFile } from "@/lib/upload";

interface UploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  type: "image" | "video";
  label: string;
  subtext?: string;
  error?: string;
  required?: boolean;
}

export default function UploadDropzone({
  value,
  onChange,
  type,
  label,
  subtext,
  error,
  required,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    // Validate file type
    if (type === "image" && !isValidImageFile(file)) {
      alert("Please upload a valid image file (PNG, JPG, or WebP)");
      return;
    }
    if (type === "video" && !isValidVideoFile(file)) {
      alert("Please upload a valid video file (MP4, MOV, or AVI)");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [type, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/png,image/jpeg,image/webp" : "video/mp4,video/mov,video/avi";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}{required && " *"}
      </label>
      
      {value ? (
        <div className="relative">
          {type === "image" ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <img
                src={value}
                alt="Preview"
                className="w-full h-40 object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-slate-100 transition"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
              <video
                src={value}
                className="w-full h-40 object-cover"
                controls
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-slate-100 transition"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-[#308FAB] bg-[#308FAB]/5"
              : error
              ? "border-red-300 bg-red-50"
              : "border-slate-300 hover:border-slate-400"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#308FAB] mb-2"></div>
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Drag your {type} here, or{" "}
                <span className="text-[#308FAB] font-medium">click to upload</span>
              </p>
              {subtext && (
                <p className="text-xs text-slate-400 mt-1">{subtext}</p>
              )}
            </>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
