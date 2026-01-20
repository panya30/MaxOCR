"use client";

import { cn } from "@/lib/utils";
import type { UploadedFile } from "./UploadZone";

export interface FilePreviewProps {
  file: UploadedFile;
  onRemove?: (id: string) => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function FilePreview({ file, onRemove, className }: FilePreviewProps) {
  const isPDF = file.file.type === "application/pdf";

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-muted/50 animate-fade-in",
        className
      )}
    >
      {/* Preview Container */}
      <div className="relative max-h-[400px] overflow-hidden">
        <img
          src={file.preview}
          alt={file.file.name}
          className={cn(
            "w-full h-auto object-contain",
            isPDF ? "p-8" : ""
          )}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
      </div>

      {/* File info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        {/* File name and size */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-sm font-medium truncate max-w-[200px]">
            {file.file.name}
          </span>
          <span className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-xs text-muted-foreground">
            {formatFileSize(file.file.size)}
          </span>
        </div>

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={() => onRemove(file.id)}
            className="px-4 py-2 bg-destructive/20 border border-destructive/30 rounded-lg text-destructive text-sm font-medium hover:bg-destructive/30 transition-colors"
            aria-label="ลบไฟล์"
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  );
}

export interface FilePreviewGridProps {
  files: UploadedFile[];
  onRemove?: (id: string) => void;
  className?: string;
}

export function FilePreviewGrid({
  files,
  onRemove,
  className,
}: FilePreviewGridProps) {
  if (files.length === 0) return null;

  // Single file - full width preview
  if (files.length === 1) {
    return (
      <FilePreview
        file={files[0]}
        onRemove={onRemove}
        className={className}
      />
    );
  }

  // Multiple files - grid layout
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {files.map((file) => (
        <FilePreviewThumbnail
          key={file.id}
          file={file}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

interface FilePreviewThumbnailProps {
  file: UploadedFile;
  onRemove?: (id: string) => void;
}

function FilePreviewThumbnail({ file, onRemove }: FilePreviewThumbnailProps) {
  const isPDF = file.file.type === "application/pdf";

  return (
    <div className="relative group rounded-xl overflow-hidden bg-muted/50 aspect-square animate-fade-in">
      <img
        src={file.preview}
        alt={file.file.name}
        className={cn(
          "w-full h-full object-cover",
          isPDF && "object-contain p-4"
        )}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
        <span className="text-xs text-center truncate w-full px-2">
          {file.file.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatFileSize(file.file.size)}
        </span>
        {onRemove && (
          <button
            onClick={() => onRemove(file.id)}
            className="mt-2 px-3 py-1 bg-destructive/30 border border-destructive/40 rounded text-destructive text-xs hover:bg-destructive/50 transition-colors"
            aria-label="ลบไฟล์"
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  );
}

export default FilePreview;
