"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToolbarStore } from "@/store/toolbar-store";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

type QuestionImageProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDialogOpenChange: (isOpen: boolean) => void;
};

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

const QuestionImage = ({
  isDialogOpen,
  setIsDialogOpen,
  onDialogOpenChange,
}: QuestionImageProps) => {
  const { setValue, watch } = useFormContext();
  const { activePassageIndex, activeQuestionGroupIndex, activeQuestionIndex } =
    useToolbarStore();

  const imagePath = `passages.${activePassageIndex}.questionGroups.${activeQuestionGroupIndex}.questions.${activeQuestionIndex}.question_data.images`;
  const currentContext = watch(imagePath);

  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const previousDialogState = useRef<boolean>(false);

  // Load existing images from context only when context changes
  useEffect(() => {
    if (currentContext && Array.isArray(currentContext)) {
      const loadedImages: ImageItem[] = [];
      currentContext.forEach((item, index) => {
        if (item instanceof File) {
          loadedImages.push({
            id: `existing-${index}`,
            file: item,
            previewUrl: URL.createObjectURL(item),
          });
        }
      });
      setSelectedImages(loadedImages);
    } else {
      setSelectedImages([]);
    }
  }, [currentContext]);

  // Handle dialog close/open changes
  useEffect(() => {
    // Only reset when dialog actually closes (was open, now closed)
    if (previousDialogState.current && !isDialogOpen) {
      // Reset state when dialog closes
      setSelectedImages((prevImages) => {
        // Cleanup blob URLs
        prevImages.forEach((img) => {
          if (img.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(img.previewUrl);
          }
        });
        return [];
      });
    }

    // Update previous state
    previousDialogState.current = isDialogOpen;
  }, [isDialogOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach((img) => {
        if (img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [selectedImages]);

  const generateId = () =>
    `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages: ImageItem[] = imageFiles.map((file) => ({
      id: generateId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);

    // Reset input value so same file can be selected again
    e.target.value = "";
  };

  const handleRemoveImage = useCallback((id: string) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove && imageToRemove.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedImages((prevImages) => {
      // Cleanup blob URLs
      prevImages.forEach((img) => {
        if (img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
      return [];
    });
  }, []);

  const handleSaveImages = useCallback(() => {
    // Save array of File objects to form context
    const files = selectedImages.map((img) => img.file);
    setValue(imagePath, files, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setIsDialogOpen(false);
  }, [selectedImages, setValue, imagePath, setIsDialogOpen]);

  const handleDialogContentClick = (e: React.MouseEvent) => {
    // Prevent dialog from closing when clicking inside dialog content
    e.stopPropagation();
  };

  return (
    <DialogContent
      className="overflow-y-auto border-none"
      onClick={handleDialogContentClick}
      data-image-dialog="true"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>Add Images</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* File Upload */}
        <div className="space-y-3">
          <Label htmlFor="image-files" className="text-sm">
            Upload Image Files
          </Label>
          <Label
            htmlFor="image-files"
            className="text-foreground flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition"
          >
            <Upload className="mb-2 h-8 w-8" />
            <span className="text-sm">Click to upload or drag & drop</span>
            <span className="mt-1 text-xs">PNG, JPG, JPEG</span>
            <Input
              id="image-files"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </Label>
          <p className="text-xs text-gray-300">
            You can select multiple images at once
          </p>
        </div>

        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Selected Images ({selectedImages.length})</Label>
              <Button
                type="button"
                variant="outline"
                size="xsm"
                onClick={handleClearAll}
              >
                <X className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            </div>
            <div className="grid max-h-60 grid-cols-2 gap-4 overflow-y-auto rounded-lg p-2 md:grid-cols-3">
              {selectedImages.map((imageItem) => (
                <div key={imageItem.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                    <Image
                      width={150}
                      height={150}
                      src={imageItem.previewUrl}
                      alt={`Preview ${imageItem.file.name}`}
                      className="h-full w-full object-cover"
                      onError={() => {
                        console.error(
                          `Failed to load image: ${imageItem.file.name}`,
                        );
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="iconSm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemoveImage(imageItem.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 p-1 text-xs text-white">
                    {imageItem.file.name}
                  </div>
                  <div className="mt-1 text-center text-xs text-gray-500">
                    {(imageItem.file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Images Display (from form context) */}
        {currentContext &&
          Array.isArray(currentContext) &&
          currentContext.length > 0 &&
          selectedImages.length === 0 && (
            <div className="space-y-3">
              <Label>Current Images ({currentContext.length})</Label>
              <div className="grid max-h-60 grid-cols-2 gap-4 overflow-y-auto rounded-lg md:grid-cols-3">
                {currentContext.map((item, index) => (
                  <div key={`current-${index}`} className="relative">
                    {item instanceof File ? (
                      <>
                        <div className="aspect-square overflow-hidden rounded-lg border border-dashed border-gray-200">
                          <Image
                            width={150}
                            height={150}
                            src={URL.createObjectURL(item)}
                            alt={`Current ${item.name}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 p-1 text-xs text-white">
                          {item.name}
                        </div>
                        <div className="mt-1 text-center text-xs text-gray-500">
                          {(item.size / 1024).toFixed(1)} KB
                        </div>
                      </>
                    ) : (
                      <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                          Unknown format
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-300">
            {selectedImages.length > 0 &&
              `${selectedImages.length} image(s) selected`}
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              size="xsm"
              variant="outline"
              onClick={() => onDialogOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="xsm"
              onClick={handleSaveImages}
              disabled={selectedImages.length === 0}
            >
              Save Images ({selectedImages.length})
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default QuestionImage;
