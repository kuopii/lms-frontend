import LazyImage from "@/components/imageReusable/base/LazyImage";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import { FaUpload } from "react-icons/fa6";

interface ImageDropzoneProps {
  fieldPrefix: string; // contoh: 'sections.0.questions.1'
}

// test comp error nested form
function getNestedError(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export const ImageDropzone = ({ fieldPrefix }: ImageDropzoneProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fieldName = `${fieldPrefix}.image` as const;

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const file = acceptedFiles[0];
          if (file) {
            field.onChange(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
          }
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          multiple: false,
          accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
          },
        });

        return (
          <div className="w-full">
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
                    <div className="relative flex h-[300px] max-w-[350px] items-center justify-center">
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
              <p className="mt-[15px] text-[12px] font-medium text-[#AAAAAA]">
                Accepted file types: JPEG/JPG, PNG
              </p>
            )}

            {/* <p className="mt-1 text-sm text-red-500">
              <ErrorForm error={getNestedError(errors, fieldName)} />
            </p> */}
          </div>
        );
      }}
    />
  );
};
