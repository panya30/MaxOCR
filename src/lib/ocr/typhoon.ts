import type { OCRMode, FigureLanguage, OCRResponse } from "@/types/ocr";

const TYPHOON_API_URL = "https://api.opentyphoon.ai/v1/chat/completions";

interface TyphoonMessage {
  role: "user";
  content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  >;
}

interface TyphoonResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const PROMPTS: Record<OCRMode, (lang?: FigureLanguage) => string> = {
  "v1.5": (lang = "Thai") => `Extract all text from the image.
Instructions:
- Only return the clean Markdown.
- Do not include any explanation or extra text.
- You must include all information on the page.

Formatting Rules:
- Tables: Render tables using <table>...</table> in clean HTML format.
- Equations: Render equations using LaTeX syntax with inline ($...$) and block ($$...$$).
- Images/Charts: Wrap visual areas in:
<figure>
Describe the image's main elements, note contextual clues, mention visible text, provide deeper analysis.
Describe in ${lang}.
</figure>
- Page Numbers: Wrap in <page_number>...</page_number>
- Checkboxes: Use ☐ for unchecked and ☑ for checked boxes.`,

  default: () =>
    `Below is an image of a document page along with its dimensions. Simply return the markdown representation of this document, presenting tables in markdown format as they naturally appear.
If the document contains images, use a placeholder like dummy.png for each image.
Your final output must be in JSON format with a single key "natural_text" containing the response.`,

  structure: () =>
    `Below is an image of a document page. Your task is to return the markdown representation of this document, presenting tables in HTML format as they naturally appear.
If the document contains images or figures, analyze them and include the tag <figure>IMAGE_ANALYSIS</figure> in the appropriate location.
Your final output must be in JSON format with a single key "natural_text" containing the response.`,
};

function getModel(mode: OCRMode): string {
  return mode === "v1.5" ? "typhoon-ocr" : "typhoon-ocr-preview";
}

function getRepetitionPenalty(mode: OCRMode): number {
  return mode === "v1.5" ? 1.1 : 1.2;
}

export async function processOCR(
  imageBase64: string,
  apiKey: string,
  options: {
    mode?: OCRMode;
    language?: FigureLanguage;
    mimeType?: string;
  } = {}
): Promise<OCRResponse> {
  const { mode = "v1.5", language = "Thai", mimeType = "image/png" } = options;
  const startTime = Date.now();

  const prompt = PROMPTS[mode](language);
  const model = getModel(mode);

  const messages: TyphoonMessage[] = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${imageBase64}`,
          },
        },
      ],
    },
  ];

  const response = await fetch(TYPHOON_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 16384,
      temperature: 0.1,
      top_p: 0.6,
      repetition_penalty: getRepetitionPenalty(mode),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API Error: ${response.status}`
    );
  }

  const data: TyphoonResponse = await response.json();
  let text = data.choices[0].message.content;

  // Parse JSON for default/structure modes
  if (mode !== "v1.5") {
    try {
      const parsed = JSON.parse(text);
      text = parsed.natural_text || text;
    } catch {
      // Keep as-is if not valid JSON
    }
  }

  return {
    text,
    metadata: {
      processingTime: Date.now() - startTime,
      mode,
      provider: "typhoon",
      model,
    },
  };
}

// Retry wrapper with exponential backoff
export async function processOCRWithRetry(
  imageBase64: string,
  apiKey: string,
  options: {
    mode?: OCRMode;
    language?: FigureLanguage;
    mimeType?: string;
    maxRetries?: number;
  } = {}
): Promise<OCRResponse> {
  const { maxRetries = 3, ...ocrOptions } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await processOCR(imageBase64, apiKey, ocrOptions);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on auth errors
      if (lastError.message.includes("401") || lastError.message.includes("403")) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw lastError;
}
