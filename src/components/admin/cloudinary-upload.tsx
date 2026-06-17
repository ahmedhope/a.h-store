"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function CloudinaryUpload({ images, onImagesChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onImagesChange(images.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="ah_srre"
        onSuccess={(result) => {
          if (typeof result.info === "object" && result.info?.secure_url) {
            onImagesChange([...images, result.info.secure_url]);
          }
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()}>
            <ImagePlus className="ml-2 h-4 w-4" />
            إضافة صورة
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
