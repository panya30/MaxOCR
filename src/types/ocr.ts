export type OCRMode = "v1.5" | "default" | "structure";

export type FigureLanguage = "Thai" | "English";

export interface OCRRequest {
  image: string; // Base64 encoded image
  mode?: OCRMode;
  language?: FigureLanguage;
  mimeType?: string;
}

export interface OCRResponse {
  text: string;
  metadata: {
    processingTime: number;
    mode: OCRMode;
    provider: "typhoon";
    model: string;
  };
}

export interface OCRError {
  error: string;
  code: string;
}

export interface BatchOCRRequest {
  files: Array<{
    name: string;
    content: string; // Base64
    mimeType?: string;
  }>;
  mode?: OCRMode;
  language?: FigureLanguage;
}

export interface BatchOCRResult {
  filename: string;
  text: string;
  status: "success" | "error";
  error?: string;
  processingTime?: number;
}

export interface BatchOCRResponse {
  results: BatchOCRResult[];
  summary: {
    total: number;
    success: number;
    failed: number;
    processingTime: number;
  };
}
