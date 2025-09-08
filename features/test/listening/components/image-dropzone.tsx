import LazyImage from "@/components/imageReusable/base/LazyImage";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";
import { FaUpload } from "react-icons/fa6";

interface ImageDropzoneProps {
  fieldPrefix: string;
}

export const ImageDropzone = ({ fieldPrefix }: ImageDropzoneProps) => {
  const { control } = useFormContext();
  const { field } = useController({ name: fieldPrefix });

  const [previewUrl, setPreviewUrl] = useState<string>();
  console.log("previewUrl ??", previewUrl);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        field.onChange(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
  });

  return (
    <div className="flex w-full flex-col gap-[14px]">
      <p className="text-[22px] font-medium">Attach Supporting Maps.</p>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-[30px] border border-dashed p-6 text-center transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {field.value ? (
          <>
            {previewUrl && (
              <div className="relative flex h-[300px] w-full items-center justify-center">
                <LazyImage
                  src={previewUrl}
                  alt="map"
                  sizes="30px"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-sm font-medium text-gray-700">
              {field.value.name}
            </p>
          </>
        ) : (
          <div className="flex h-[256px] flex-col items-center justify-center gap-[20px]">
            <FaUpload className="size-[70px]" />
            <div className="flex flex-col gap-1">
              <p className="text-white">Drag and Drop your image</p>
              <p className="text-white">or</p>
              <p className="text-primary">Browse Files</p>
            </div>
          </div>
        )}
      </div>
      {!field.value && (
        <p className="text-[12px] font-medium text-[#AAAAAA]">
          Accepted file types: JPEG/JPG, PNG
        </p>
      )}
    </div>
  );
};
