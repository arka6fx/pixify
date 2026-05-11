"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadDropzone({
  label,
  accept,
  onUpload,
  previewUrl,
  onRemove,
}: {
  label: string;
  accept?: string;
  onUpload: (file: File) => void;
  previewUrl?: string | null;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  if (previewUrl) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-card border border-border group">
        <Image
          src={previewUrl}
          alt={label}
          fill
          className="object-cover"
          sizes="380px"
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove ${label}`}
          >
            <X className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors duration-150",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-transparent hover:border-border/60 hover:bg-accent/30"
        )}
      >
        <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground text-center">
          Drop {label} here...
        </p>
        <span className="text-xs text-muted-foreground/60">or click to browse</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
