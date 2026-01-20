/**
 * MaxOCR Thai OCR Benchmark Suite
 *
 * Measures OCR accuracy against ground truth Thai text samples.
 * Run with: npm run test:ocr
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface Sample {
  id: string;
  category: 'printed' | 'handwriting' | 'mixed';
  groundTruth: string;
  imagePath?: string;
}

interface BenchmarkResult {
  sampleId: string;
  category: string;
  characterAccuracy: number;
  wordAccuracy: number;
  levenshteinDistance: number;
  groundTruthLength: number;
  ocrOutputLength: number;
}

interface CategoryStats {
  category: string;
  samples: number;
  avgCharacterAccuracy: number;
  avgWordAccuracy: number;
}

// ============================================================================
// Constants
// ============================================================================

const DATASETS_DIR = join(__dirname, '../datasets');
const CATEGORIES = ['printed', 'handwriting', 'mixed'] as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Create distance matrix
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate character-level accuracy
 */
function calculateCharacterAccuracy(groundTruth: string, ocrOutput: string): number {
  if (groundTruth.length === 0) return ocrOutput.length === 0 ? 1 : 0;

  const distance = levenshteinDistance(groundTruth, ocrOutput);
  const maxLength = Math.max(groundTruth.length, ocrOutput.length);

  return Math.max(0, 1 - distance / maxLength);
}

/**
 * Simple Thai word segmentation (placeholder - use proper library in production)
 * Note: For production, use libraries like 'thai-segmentation' or 'wordcut'
 */
function segmentThaiWords(text: string): string[] {
  // This is a simplified version - spaces and newlines as delimiters
  // Production should use proper Thai word segmentation
  return text
    .split(/[\s\n]+/)
    .filter((word) => word.length > 0);
}

/**
 * Calculate word-level accuracy
 */
function calculateWordAccuracy(groundTruth: string, ocrOutput: string): number {
  const gtWords = segmentThaiWords(groundTruth);
  const ocrWords = segmentThaiWords(ocrOutput);

  if (gtWords.length === 0) return ocrWords.length === 0 ? 1 : 0;

  let matches = 0;
  const ocrWordSet = new Set(ocrWords);

  for (const word of gtWords) {
    if (ocrWordSet.has(word)) {
      matches++;
    }
  }

  return matches / Math.max(gtWords.length, ocrWords.length);
}

/**
 * Normalize Thai text for comparison
 * - Remove extra whitespace
 * - Normalize Unicode forms
 */
function normalizeThaiText(text: string): string {
  return text
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .trim();
}

// ============================================================================
// Dataset Loading
// ============================================================================

/**
 * Load all samples from a category
 */
async function loadCategory(
  category: (typeof CATEGORIES)[number]
): Promise<Sample[]> {
  const categoryDir = join(DATASETS_DIR, category);
  const files = await readdir(categoryDir);
  const samples: Sample[] = [];

  for (const file of files) {
    if (file.endsWith('.txt') && file !== '.gitkeep') {
      const content = await readFile(join(categoryDir, file), 'utf-8');
      const id = file.replace('.txt', '');

      // Check if corresponding image exists
      const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
      let imagePath: string | undefined;

      for (const ext of possibleExtensions) {
        const imgFile = join(categoryDir, `${id}${ext}`);
        try {
          await readFile(imgFile);
          imagePath = imgFile;
          break;
        } catch {
          // Image doesn't exist with this extension
        }
      }

      samples.push({
        id,
        category,
        groundTruth: normalizeThaiText(content),
        imagePath,
      });
    }
  }

  return samples.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Load all datasets
 */
async function loadAllDatasets(): Promise<Sample[]> {
  const allSamples: Sample[] = [];

  for (const category of CATEGORIES) {
    const samples = await loadCategory(category);
    allSamples.push(...samples);
  }

  return allSamples;
}

// ============================================================================
// OCR Interface (Placeholder)
// ============================================================================

/**
 * Placeholder OCR function - replace with actual Typhoon OCR call
 */
async function runOCR(imagePath: string): Promise<string> {
  // TODO: Implement actual OCR call to Typhoon API
  // Example:
  // const response = await typhoonOCR.processImage(imagePath);
  // return response.text;

  throw new Error(`OCR not implemented. Image: ${imagePath}`);
}

// ============================================================================
// Benchmark Runner
// ============================================================================

/**
 * Run benchmark on a single sample
 */
async function benchmarkSample(sample: Sample): Promise<BenchmarkResult | null> {
  if (!sample.imagePath) {
    console.warn(`No image found for sample: ${sample.id}`);
    return null;
  }

  try {
    const ocrOutput = await runOCR(sample.imagePath);
    const normalizedOutput = normalizeThaiText(ocrOutput);

    return {
      sampleId: sample.id,
      category: sample.category,
      characterAccuracy: calculateCharacterAccuracy(
        sample.groundTruth,
        normalizedOutput
      ),
      wordAccuracy: calculateWordAccuracy(sample.groundTruth, normalizedOutput),
      levenshteinDistance: levenshteinDistance(
        sample.groundTruth,
        normalizedOutput
      ),
      groundTruthLength: sample.groundTruth.length,
      ocrOutputLength: normalizedOutput.length,
    };
  } catch (error) {
    console.error(`Error processing sample ${sample.id}:`, error);
    return null;
  }
}

/**
 * Calculate category statistics
 */
function calculateCategoryStats(results: BenchmarkResult[]): CategoryStats[] {
  const categoryMap = new Map<string, BenchmarkResult[]>();

  for (const result of results) {
    const existing = categoryMap.get(result.category) || [];
    existing.push(result);
    categoryMap.set(result.category, existing);
  }

  const stats: CategoryStats[] = [];

  for (const [category, categoryResults] of categoryMap) {
    const avgCharAccuracy =
      categoryResults.reduce((sum, r) => sum + r.characterAccuracy, 0) /
      categoryResults.length;
    const avgWordAccuracy =
      categoryResults.reduce((sum, r) => sum + r.wordAccuracy, 0) /
      categoryResults.length;

    stats.push({
      category,
      samples: categoryResults.length,
      avgCharacterAccuracy: avgCharAccuracy,
      avgWordAccuracy: avgWordAccuracy,
    });
  }

  return stats;
}

/**
 * Print benchmark report
 */
function printReport(results: BenchmarkResult[], stats: CategoryStats[]): void {
  console.log('\n=== MaxOCR Thai Benchmark Report ===\n');

  console.log('Category Statistics:');
  console.log('-'.repeat(60));

  for (const stat of stats) {
    console.log(`\n${stat.category.toUpperCase()}`);
    console.log(`  Samples: ${stat.samples}`);
    console.log(`  Character Accuracy: ${(stat.avgCharacterAccuracy * 100).toFixed(2)}%`);
    console.log(`  Word Accuracy: ${(stat.avgWordAccuracy * 100).toFixed(2)}%`);
  }

  const totalCharAccuracy =
    results.reduce((sum, r) => sum + r.characterAccuracy, 0) / results.length;
  const totalWordAccuracy =
    results.reduce((sum, r) => sum + r.wordAccuracy, 0) / results.length;

  console.log('\n' + '='.repeat(60));
  console.log(`OVERALL (${results.length} samples)`);
  console.log(`  Character Accuracy: ${(totalCharAccuracy * 100).toFixed(2)}%`);
  console.log(`  Word Accuracy: ${(totalWordAccuracy * 100).toFixed(2)}%`);
  console.log('='.repeat(60) + '\n');
}

// ============================================================================
// Test Suite
// ============================================================================

describe('MaxOCR Thai Benchmark', () => {
  let samples: Sample[];

  beforeAll(async () => {
    samples = await loadAllDatasets();
  });

  it('should load all datasets', () => {
    expect(samples.length).toBeGreaterThanOrEqual(30);
  });

  it('should have 15 printed samples', async () => {
    const printed = await loadCategory('printed');
    expect(printed.length).toBe(15);
  });

  it('should have 10 handwriting samples', async () => {
    const handwriting = await loadCategory('handwriting');
    expect(handwriting.length).toBe(10);
  });

  it('should have 5 mixed samples', async () => {
    const mixed = await loadCategory('mixed');
    expect(mixed.length).toBe(5);
  });

  it('should correctly calculate character accuracy', () => {
    // Exact match
    expect(calculateCharacterAccuracy('สวัสดี', 'สวัสดี')).toBe(1);

    // One character difference
    const accuracy = calculateCharacterAccuracy('สวัสดี', 'สวัสดา');
    expect(accuracy).toBeGreaterThan(0.8);
    expect(accuracy).toBeLessThan(1);

    // Empty strings
    expect(calculateCharacterAccuracy('', '')).toBe(1);
    expect(calculateCharacterAccuracy('สวัสดี', '')).toBe(0);
  });

  it('should correctly calculate Levenshtein distance', () => {
    expect(levenshteinDistance('', '')).toBe(0);
    expect(levenshteinDistance('abc', 'abc')).toBe(0);
    expect(levenshteinDistance('abc', 'abd')).toBe(1);
    expect(levenshteinDistance('สวัสดี', 'สวัสดา')).toBe(1);
  });

  // Skip actual OCR tests until images are available
  it.skip('should run full benchmark when images are available', async () => {
    const results: BenchmarkResult[] = [];

    for (const sample of samples) {
      const result = await benchmarkSample(sample);
      if (result) {
        results.push(result);
      }
    }

    const stats = calculateCategoryStats(results);
    printReport(results, stats);

    // Accuracy thresholds
    const overallCharAccuracy =
      results.reduce((sum, r) => sum + r.characterAccuracy, 0) / results.length;

    expect(overallCharAccuracy).toBeGreaterThan(0.9); // 90% minimum
  });
});

// ============================================================================
// CLI Runner (for standalone execution)
// ============================================================================

async function runBenchmarkCLI(): Promise<void> {
  console.log('Loading datasets...');
  const samples = await loadAllDatasets();
  console.log(`Loaded ${samples.length} samples`);

  const results: BenchmarkResult[] = [];

  for (const sample of samples) {
    if (sample.imagePath) {
      console.log(`Processing: ${sample.id}`);
      const result = await benchmarkSample(sample);
      if (result) {
        results.push(result);
      }
    }
  }

  if (results.length > 0) {
    const stats = calculateCategoryStats(results);
    printReport(results, stats);
  } else {
    console.log('\nNo images found. Add images to run OCR benchmark.');
    console.log('Ground truth samples are available in tests/datasets/');
  }
}

// Export for use in other tests
export {
  loadAllDatasets,
  loadCategory,
  benchmarkSample,
  calculateCharacterAccuracy,
  calculateWordAccuracy,
  levenshteinDistance,
  normalizeThaiText,
  runBenchmarkCLI,
  type Sample,
  type BenchmarkResult,
  type CategoryStats,
};
