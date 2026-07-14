"use client";

import { useState } from "react";
import { UploadButton } from "@/app/utils/uploadthing";
import { Loader2 } from "lucide-react";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full">
      <UploadButton
        endpoint="imageUploader"
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res?.[0]?.url) {
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(err: Error) => {
          setIsUploading(false);
          console.error("Error al subir:", err.message);
        }}
        appearance={{
          button: "w-full bg-[#B57C38] text-white font-bold py-2 rounded-lg hover:bg-[#9a6a2f] transition-all",
          allowedContent: "hidden",
          container: "w-full",
        }}
        content={{
          // Usamos _ready para indicar que es una variable intencionalmente no usada
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          button({ ready: ready }) {
            if (isUploading) return <Loader2 className="animate-spin w-5 h-5" />;
            return "SUBIR IMAGEN";
          },
        }}
      />
    </div>
  );
}