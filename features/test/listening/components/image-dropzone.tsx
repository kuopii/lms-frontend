import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";
import { FaUpload } from "react-icons/fa6";

interface ImageDropzoneProps {
  fieldPrefix: string;
  showActions?: boolean;
}

export const ImageDropzone = ({
  fieldPrefix,
  showActions,
}: ImageDropzoneProps) => {
  const { field } = useController({ name: fieldPrefix });

  const [previewUrl, setPreviewUrl] = useState<string>();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        field.onChange([file]);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
  });

  const file = Array.isArray(field.value) ? field.value[0] : null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-[14px]">
      <p className="text-[22px] font-medium">Attach Supporting Maps.</p>
      <div
        {...getRootProps()}
        className={`flex aspect-video w-full max-w-[600px] cursor-pointer flex-col gap-2 rounded-[30px] border border-dashed text-center transition ${
          isDragActive ? "border-primary" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <>
            {previewUrl && (
              <div className="group relative flex aspect-video w-full items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="map"
                  sizes="100vw"
                  fill
                  className="object-contain"
                  loading="lazy"
                />

                {showActions && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="iconSm"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full border p-0 opacity-100 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(null);
                      setPreviewUrl(undefined);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            <p className="text-sm font-medium text-[#AAAAAA]">
              {field.value[0].name}
            </p>
          </>
        ) : (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-[20px]">
            <FaUpload className="size-[70px]" />
            <div className="flex flex-col gap-1">
              <p className="text-white">Drag and Drop your image</p>
              <p className="text-white">or</p>
              <p className="text-primary">Browse Files</p>
            </div>
          </div>
        )}
      </div>
      {file ? (
        ""
      ) : (
        <p className="text-[12px] font-medium text-[#AAAAAA]">
          Accepted file types: JPEG/JPG, PNG
        </p>
      )}
    </div>
  );
};
