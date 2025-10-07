"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { MdImage } from "react-icons/md";
import Image from "next/image";
import { Input } from "@/components/ui/input";

type ImageContextUploadProps = {
  value: File | null;
  onChange: (value: File | null) => void;
  className?: string;
};

export const ImageContextUpload = ({
  value,
  onChange,
  className,
}: ImageContextUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value ? URL.createObjectURL(value) : null,
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type (only PNG and JPG/JPEG)
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload PNG or JPG/JPEG file only");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Clean up old preview URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onChange(file);
    },
    [onChange, previewUrl],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(() => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange, previewUrl]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {previewUrl ? (
        <div className="group relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-4xl bg-[#333333]">
            <Image
              src={previewUrl}
              alt="Context image"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              size="iconSm"
              variant="destructive"
              onClick={handleRemove}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-4xl bg-[#333333] p-8 transition-colors",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-gray-600 hover:border-gray-500",
          )}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <MdImage className="mb-4 text-gray-400" size={48} />

          <p className="mb-2 text-center text-sm font-medium text-gray-300">
            {isDragging
              ? "Drop image here"
              : "Click to upload or drag and drop"}
          </p>

          <p className="text-center text-xs text-gray-500">
            PNG or JPG/JPEG up to 2MB
          </p>

          <Button
            type="button"
            variant="outline"
            size="xsm"
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <FaUpload className="mr-2" />
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
};
