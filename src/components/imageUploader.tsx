import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  disabled
}) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]!);
        onUpload(acceptedFiles[0]!);
      } catch (error) {
        console.log(error);
        setPreview(null);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
      disabled
    });

  const removeImage = useCallback(() => {
    setPreview(null);
  }, [setPreview]);

  return (
    <Card
      {...getRootProps()}
      className="relative flex h-80 w-full min-w-[200px] cursor-pointer flex-col items-center justify-center"
    >
      {preview && (
        <>
          <img
            src={preview as string}
            alt="Uploaded image"
            className="h-full w-full rounded-lg object-cover object-center"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
            className="absolute right-2 top-2 p-2"
            variant="destructive"
          >
            <X className="size-4" />
          </Button>
        </>
      )}
      <ImagePlus
        className={`size-24 text-muted-foreground ${preview ? 'hidden' : 'block'}`}
      />
      <Input {...getInputProps()} type="file" disabled={disabled} />
      {isDragActive && <p>Drop the image!</p>}
      {fileRejections.length !== 0 && (
        <p>Image must be less than 1MB and of type png, jpg, or jpeg</p>
      )}
    </Card>
  );
};
