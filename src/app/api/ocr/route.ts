import { NextRequest, NextResponse } from "next/server";
import { processOCRWithRetry } from "@/lib/ocr/typhoon";
import type { OCRRequest, OCRResponse, OCRError } from "@/types/ocr";

export async function POST(request: NextRequest) {
  try {
    const body: OCRRequest = await request.json();

    // Validate required fields
    if (!body.image) {
      return NextResponse.json<OCRError>(
        { error: "Image is required", code: "MISSING_IMAGE" },
        { status: 400 }
      );
    }

    // Get API key from environment or request
    const apiKey = process.env.TYPHOON_API_KEY;
    if (!apiKey) {
      return NextResponse.json<OCRError>(
        { error: "API key not configured", code: "MISSING_API_KEY" },
        { status: 500 }
      );
    }

    // Process OCR
    const result = await processOCRWithRetry(body.image, apiKey, {
      mode: body.mode || "v1.5",
      language: body.language || "Thai",
      mimeType: body.mimeType || "image/png",
    });

    return NextResponse.json<OCRResponse>(result);
  } catch (error) {
    console.error("OCR Error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    // Handle specific errors
    if (message.includes("401") || message.includes("403")) {
      return NextResponse.json<OCRError>(
        { error: "Invalid API key", code: "AUTH_ERROR" },
        { status: 401 }
      );
    }

    if (message.includes("429")) {
      return NextResponse.json<OCRError>(
        { error: "Rate limit exceeded. Please try again later.", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    return NextResponse.json<OCRError>(
      { error: message, code: "OCR_ERROR" },
      { status: 500 }
    );
  }
}
