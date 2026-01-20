"use client";

import { cn } from "@/lib/utils";

export type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export interface UploadProgressProps {
  status: UploadStatus;
  progress?: number; // 0-100
  message?: string;
  className?: string;
}

const STATUS_CONFIG: Record<
  UploadStatus,
  {
    icon: string;
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  idle: {
    icon: "⏸️",
    label: "รอดำเนินการ",
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted/30",
    borderClass: "border-border",
  },
  uploading: {
    icon: "📤",
    label: "กำลังอัปโหลด...",
    colorClass: "text-gold",
    bgClass: "bg-gold/10",
    borderClass: "border-gold/30",
  },
  processing: {
    icon: "🔄",
    label: "กำลังประมวลผล...",
    colorClass: "text-teal",
    bgClass: "bg-teal/10",
    borderClass: "border-teal/30",
  },
  success: {
    icon: "✅",
    label: "สำเร็จ!",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
  },
  error: {
    icon: "❌",
    label: "เกิดข้อผิดพลาด",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
  },
};

export function UploadProgress({
  status,
  progress = 0,
  message,
  className,
}: UploadProgressProps) {
  const config = STATUS_CONFIG[status];
  const showProgress = status === "uploading" || status === "processing";
  const isAnimating = status === "uploading" || status === "processing";

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all duration-300 animate-fade-in",
        config.bgClass,
        config.borderClass,
        className
      )}
    >
      {/* Status header */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={cn(
            "text-2xl",
            isAnimating && "animate-pulse"
          )}
        >
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium", config.colorClass)}>
            {message || config.label}
          </p>
          {showProgress && (
            <p className="text-sm text-muted-foreground">
              {progress.toFixed(0)}% เสร็จสิ้น
            </p>
          )}
        </div>
        {showProgress && (
          <span className={cn("text-lg font-mono", config.colorClass)}>
            {progress.toFixed(0)}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
              status === "uploading"
                ? "bg-gradient-to-r from-gold to-gold/80"
                : "bg-gradient-to-r from-teal to-teal/80"
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
          {/* Animated shimmer */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full",
              isAnimating && "animate-[shimmer_1.5s_infinite]"
            )}
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Spinner component for inline loading states
export function UploadSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={cn(
        "rounded-full border-gold/30 border-t-gold animate-spin",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="กำลังโหลด"
    >
      <span className="sr-only">กำลังโหลด...</span>
    </div>
  );
}

// Multi-file progress tracker
export interface FileProgress {
  id: string;
  name: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

export interface MultiFileProgressProps {
  files: FileProgress[];
  className?: string;
}

export function MultiFileProgress({ files, className }: MultiFileProgressProps) {
  if (files.length === 0) return null;

  const completedCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const totalProgress =
    files.reduce((sum, f) => sum + f.progress, 0) / files.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          ประมวลผล {completedCount}/{files.length} ไฟล์
        </span>
        <span className="text-gold font-mono">{totalProgress.toFixed(0)}%</span>
      </div>

      {/* Overall progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold to-teal rounded-full transition-all duration-300"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* Individual file progress */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {files.map((file) => (
          <FileProgressItem key={file.id} file={file} />
        ))}
      </div>

      {/* Error summary */}
      {errorCount > 0 && (
        <p className="text-sm text-destructive">
          {errorCount} ไฟล์ เกิดข้อผิดพลาด
        </p>
      )}
    </div>
  );
}

function FileProgressItem({ file }: { file: FileProgress }) {
  const config = STATUS_CONFIG[file.status];

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg",
        config.bgClass,
        "border",
        config.borderClass
      )}
    >
      <span className="text-lg">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{file.name}</p>
        {file.error && (
          <p className="text-xs text-destructive truncate">{file.error}</p>
        )}
      </div>
      {(file.status === "uploading" || file.status === "processing") && (
        <span className="text-xs text-muted-foreground font-mono">
          {file.progress.toFixed(0)}%
        </span>
      )}
    </div>
  );
}

export default UploadProgress;
