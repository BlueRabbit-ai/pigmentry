"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, Image, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE } from "@/lib/constants";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  onFileRemoved: () => void;
  selectedFile: File | null;
}

export function UploadZone({
  onFileAccepted,
  onFileRemoved,
  selectedFile,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      return "Unsupported file type. Please upload a JPEG, PNG, or WebP image.";
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return `File is too large. Maximum size is ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onFileAccepted(file);
    },
    [validateFile, onFileAccepted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    onFileRemoved();
    if (inputRef.current) inputRef.current.value = "";
  }, [onFileRemoved]);

  if (selectedFile && preview) {
    return (
      <div className="relative">
        <div className="relative rounded-xl overflow-hidden border-2 border-primary/30">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full max-h-80 object-contain bg-muted/30"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background border shadow-sm transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Image className="size-4" />
          <span className="truncate">{selectedFile.name}</span>
          <span className="shrink-0">
            ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_MIME_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
        <Upload className="size-10 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-sm font-medium">
          Drop your photo here or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG, PNG, or WebP — up to 20MB
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose File
        </Button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="size-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
