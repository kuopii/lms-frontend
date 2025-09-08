import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";
import { FaUpload } from "react-icons/fa6";
import { CreateListeningTestSchema } from "../../form/create-listening-form";

interface AudioDropzoneParams {
  // qgIndex: number;
  index: number;
}

export const AudioDropzone = ({ index }: AudioDropzoneParams) => {
  const { control } = useFormContext<CreateListeningTestSchema>();
  const { field } = useController({ name: `passages.${index}.audio_file` });

  // console.log("error audio :", error);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "audio/mpeg": [".mp3"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        field.onChange(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
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
          <p className="text-sm font-medium text-gray-700">
            🎵 {field.value.name}
          </p>
        ) : (
          <div className="flex h-[256px] flex-col items-center justify-center gap-[20px]">
            <div>
              <FaUpload className="size-[70px]" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-white">Drag and Drop here</p>
              <p className="text-white">or</p>
              <p className="text-primary">Browse Files</p>
            </div>
          </div>
        )}
      </div>

      {/* <p className="mt-1 text-sm text-red-500">
              <ErrorForm
                error={(errors?.sections?.[sectionIndex] as any)?.audio}
              />
            </p> */}

      {/* Preview Audio */}
      {previewUrl && (
        <div className="mt-4">
          <audio controls src={previewUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};
