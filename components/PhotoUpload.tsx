"use client";

import { useState, useRef } from "react";

interface PhotoUploadProps {
  onPhotoSelected: (file: File | null) => void;
}

export function PhotoUpload({ onPhotoSelected }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null | undefined) => {
    if (!file) {
      setPreview(null);
      onPhotoSelected(null);
      return;
    }
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onPhotoSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="field">
      <label className="field-label">Photo</label>

      <div className="photo-wrap">
        <div
          className={`photo-box ${isDragging ? "dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {preview ? (
            <>
              <img src={preview} alt="Pet preview" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFile(null);
                }}
                className="photo-remove"
                aria-label="Replace photo"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="photo-placeholder">
              <div className="photo-plus">+</div>
              <p className="photo-hint">Add a photo</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label="Upload pet photo"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
