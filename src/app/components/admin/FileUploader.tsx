"use client";

import { useState } from "react";
import { UploadButton } from "@/app/utils/uploadthing";
import { Loader2, UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
}

interface UploadedFileResponse {
  name: string;
  size: number;
  key: string;
  url: string;
}

export default function FileUploader({ onUploadComplete, currentUrl }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <div className="w-full space-y-3">
      {}
      <style dangerouslySetInnerHTML={{ __html: `
        /* 1. Forzamos transparencia total y nulidad de tamaño de texto al input nativo */
        .ut-button input[type="file"],
        [data-ut-element="button"] input[type="file"] {
          opacity: 0 !important;
          font-size: 0 !important;
          color: transparent !important;
          background: transparent !important;
          border: none !important;
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          cursor: pointer !important;
          z-index: 10 !important;
        }

        /* 2. Ocultamos el botón nativo en navegadores Webkit (Chrome, Edge, Safari) */
        .ut-button input[type="file"]::-webkit-file-upload-button,
        [data-ut-element="button"] input[type="file"]::-webkit-file-upload-button {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* 3. Ocultamos el selector de archivos nativo en Firefox */
        .ut-button input[type="file"]::file-selector-button,
        [data-ut-element="button"] input[type="file"]::file-selector-button {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* 4. Bloqueamos cualquier contenido residual inyectado por la librería */
        .ut-allowed-content {
          display: none !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
        }
      `}} />
      
      {}
      {currentUrl && !isUploading && (
        <div className="bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-300 bg-white shadow-xs shrink-0">
            <Image
              src={currentUrl}
              alt="Vista previa del producto"
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">¡Imagen cargada!</span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium">
              La fotografía ya está guardada en los servidores de DecorArte.
            </p>
            
            <button
              type="button"
              onClick={() => onUploadComplete("")}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-stone-50 text-stone-700 hover:text-[#B57C38] border border-stone-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-2xs active:translate-y-px"
            >
              <RefreshCw className="w-3 h-3" />
              Cambiar Fotografía
            </button>
          </div>
        </div>
      )}

      {}
      {(!currentUrl || isUploading) && (
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] text-center
            ${isUploading 
              ? "border-[#B57C38] bg-amber-50/20" 
              : "border-stone-200 hover:border-[#B57C38] bg-[#FCF9F5] hover:bg-[#FAF6F0]"
            }
          `}
        >
          {isUploading ? (
            <div className="space-y-3 animate-pulse">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-[#B57C38] animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-[#B57C38] uppercase tracking-wider">
                  Procesando Pieza Rústica...
                </h4>
                <p className="text-[10px] text-stone-500 font-medium">
                  Subiendo fotografía a los servidores seguros del taller.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 w-full flex flex-col items-center">
              <div className="p-3 bg-stone-100 rounded-full text-stone-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-black text-stone-700 uppercase tracking-widest">
                  Adjuntar Archivo de Imagen
                </h4>
                <p className="text-[10px] text-stone-400 font-bold">
                  Soporta JPG, PNG o WEBP de hasta 4MB
                </p>
              </div>

              {}
              <div className="w-full max-w-[200px] relative">
                <UploadButton
                  endpoint="imageUploader"
                  onUploadBegin={() => {
                    setIsUploading(true);
                    setUploadError(null);
                  }}
                  onClientUploadComplete={(res?: UploadedFileResponse[]) => {
                    setIsUploading(false);
                    if (res?.[0]?.url) {
                      onUploadComplete(res[0].url);
                    }
                  }}
                  onUploadError={(err: Error) => {
                    setIsUploading(false);
                    setUploadError(err.message || "No se pudo completar la transferencia.");
                    console.error("Fallo de subida:", err.message);
                  }}
                  appearance={{
                    button: "w-full bg-[#1C1816] hover:bg-[#B57C38] text-[#FFC107] hover:text-white font-black uppercase text-[10px] py-2.5 px-4 rounded-xl transition-all shadow-[0_3px_0px_#B57C38] active:translate-y-px active:shadow-none cursor-pointer relative overflow-hidden",
                    allowedContent: "hidden", 
                    container: "w-full flex justify-center",
                  }}
                  content={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    button({ ready: _ready }: { ready: boolean }) {
                      return "SELECCIONAR FOTO";
                    },
                    allowedContent() {
                      return "";
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider block">Fallo en la carga</span>
            <p className="text-[9px] text-red-700/80 font-bold leading-relaxed">
              Ocurrió un error al procesar tu archivo: {uploadError}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}