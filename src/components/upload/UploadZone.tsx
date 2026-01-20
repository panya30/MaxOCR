"use client";

import { useCallback, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export interface UploadZoneProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
}

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const ACCEPTED_EXTENSIONS = Object.values(ACCEPTED_TYPES).flat().join(", ");

export function UploadZone({
  onFilesSelected,
  accept = ".jpg,.jpeg,.png,.webp,.pdf",
  multiple = false,
  maxSize = 10, // 10MB default
  disabled = false,
  className,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      const isValidType = Object.keys(ACCEPTED_TYPES).includes(file.type);
      if (!isValidType) {
        return `ไฟล์ประเภท ${file.type || "ไม่ทราบ"} ไม่รองรับ`;
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        return `ไฟล์ขนาดใหญ่เกินไป (${sizeMB.toFixed(1)} MB) สูงสุด ${maxSize} MB`;
      }

      return null;
    },
    [maxSize]
  );

  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type === "application/pdf") {
        // Create PDF placeholder SVG
        const svgPlaceholder = `data:image/svg+xml,${encodeURIComponent(`
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1a1a24"/>
            <text x="50%" y="45%" text-anchor="middle" fill="#d4a853" font-size="48">📄</text>
            <text x="50%" y="65%" text-anchor="middle" fill="#9a9a9a" font-size="14" font-family="system-ui">PDF Document</text>
          </svg>
        `)}`;
        resolve(svgPlaceholder);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setError(null);
      const files = Array.from(fileList);
      const filesToProcess = multiple ? files : [files[0]];

      const uploadedFiles: UploadedFile[] = [];
      const errors: string[] = [];

      for (const file of filesToProcess) {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
          continue;
        }

        const preview = await createPreview(file);
        uploadedFiles.push({
          file,
          preview,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        });
      }

      if (errors.length > 0) {
        setError(errors.join("\n"));
      }

      if (uploadedFiles.length > 0) {
        onFilesSelected(uploadedFiles);
      }
    },
    [multiple, validateFile, createPreview, onFilesSelected]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [disabled, processFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input to allow selecting the same file again
      e.target.value = "";
    },
    [processFiles]
  );

  return (
    <div className={cn("relative", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden",
          "bg-muted/30",
          isDragOver && !disabled
            ? "border-gold/60 bg-gold/10 scale-[1.02]"
            : "border-border hover:border-gold/40 hover:bg-gold/5",
          disabled && "opacity-50 cursor-not-allowed hover:border-border hover:bg-muted/30"
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="อัปโหลดไฟล์"
        aria-disabled={disabled}
      >
        {/* Gradient overlay on hover/drag */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none",
            (isDragOver || !disabled) && "group-hover:opacity-100",
            isDragOver && "opacity-100"
          )}
        />

        {/* Content */}
        <div className="relative z-10">
          <div
            className={cn(
              "text-5xl mb-4 transition-transform duration-300",
              isDragOver ? "scale-110" : "opacity-60"
            )}
          >
            {isDragOver ? "📥" : "📁"}
          </div>

          <p className="text-muted-foreground mb-2">
            {isDragOver ? (
              <span className="text-gold font-medium">วางไฟล์ที่นี่!</span>
            ) : (
              <>
                ลากไฟล์มาวางที่นี่ หรือ{" "}
                <span className="text-gold font-medium">คลิกเพื่อเลือก</span>
              </>
            )}
          </p>

          <p className="text-sm text-muted-foreground/60">
            รองรับ JPG, PNG, WEBP, PDF (สูงสุด {maxSize} MB)
          </p>
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive animate-fade-in">
          {error.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadZone;
