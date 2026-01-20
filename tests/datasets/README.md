# Thai OCR Test Dataset

Ground truth text samples for testing MaxOCR accuracy.

## Dataset Structure

```
datasets/
├── printed/           # 15 samples - Formal printed Thai text
│   └── sample_XXX.txt
├── handwriting/       # 10 samples - Simpler handwritten-style text
│   └── sample_XXX.txt
└── mixed/             # 5 samples - Thai-English mixed content
    └── sample_XXX.txt
```

## Sample Categories

### Printed (15 samples)
- **sample_001-002**: Basic Thai sentences and paragraphs
- **sample_003**: Tone marks (ก่อ ก้าว ก๊อก ก๋า)
- **sample_004**: Thai and Arabic numerals (๑๒๓๔๕ / 12345)
- **sample_005**: Geographic information with numbers
- **sample_006**: Thai vowels (สระ)
- **sample_007**: Thai consonants (พยัญชนะ ๔๔ ตัว)
- **sample_008**: Tone mark explanations
- **sample_009**: Receipt format with prices
- **sample_010**: Long paragraph text
- **sample_011**: Address format
- **sample_012**: Words with silent marks (ตัวการันต์)
- **sample_013**: Thai proverbs (สุภาษิต)
- **sample_014**: Restaurant menu with prices
- **sample_015**: Public notice/announcement

### Handwriting (10 samples)
- **sample_001-008**: Simple Thai phrases and greetings
- **sample_009**: Phone number
- **sample_010**: Daily diary entry

### Mixed (5 samples)
- **sample_001**: Basic Thai-English greeting
- **sample_002**: Product branding
- **sample_003**: Contact information
- **sample_004**: Product label
- **sample_005**: Airport signage

## Character Coverage

### Thai Consonants (พยัญชนะ)
All 44 Thai consonants are covered:
```
ก ข ฃ ค ฅ ฆ ง จ ฉ ช ซ ฌ ญ ฎ ฏ
ฐ ฑ ฒ ณ ด ต ถ ท ธ น บ ป ผ ฝ พ
ฟ ภ ม ย ร ล ว ศ ษ ส ห ฬ อ ฮ
```

### Thai Vowels (สระ)
All vowel forms covered:
- Simple vowels: อะ อา อิ อี อึ อือ อุ อู
- Compound vowels: เอะ เอ แอะ แอ โอะ โอ เอาะ ออ
- Diphthongs: เอียะ เอีย เอือะ เอือ อัวะ อัว

### Tone Marks (วรรณยุกต์)
- ่ (ไม้เอก) - e.g., ก่อ แก่ แม่
- ้ (ไม้โท) - e.g., ก้าง ก้อง ช้าง
- ๊ (ไม้ตรี) - e.g., โก๊ะ โต๊ะ
- ๋ (ไม้จัตวา) - e.g., ก๋า

### Thai Numerals (ตัวเลขไทย)
```
๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙
```

### Special Characters
- Silent mark (์) - ตัวการันต์
- Repetition mark (ๆ)
- Thai currency symbol (฿)

## How to Add New Samples

1. **Create ground truth file**:
   ```bash
   # For printed text
   echo "ข้อความภาษาไทย" > tests/datasets/printed/sample_016.txt

   # For handwriting
   echo "ข้อความสั้น" > tests/datasets/handwriting/sample_011.txt

   # For mixed content
   echo "Thai and English" > tests/datasets/mixed/sample_006.txt
   ```

2. **Naming convention**: `sample_XXX.txt` (3-digit zero-padded)

3. **Corresponding image**: When adding test images, name them with the same number:
   ```
   tests/datasets/printed/sample_016.png  # Image
   tests/datasets/printed/sample_016.txt  # Ground truth
   ```

4. **Update this README** with sample description if adding a new category.

## Usage in Tests

```typescript
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const DATASETS_DIR = 'tests/datasets';

async function loadDataset(category: 'printed' | 'handwriting' | 'mixed') {
  const dir = join(DATASETS_DIR, category);
  const files = await readdir(dir);
  const samples = [];

  for (const file of files) {
    if (file.endsWith('.txt')) {
      const content = await readFile(join(dir, file), 'utf-8');
      samples.push({ id: file.replace('.txt', ''), groundTruth: content.trim() });
    }
  }

  return samples;
}
```

## Statistics

| Category | Samples | Focus |
|----------|---------|-------|
| Printed | 15 | Full character set, complex text |
| Handwriting | 10 | Simple phrases, numbers |
| Mixed | 5 | Thai-English bilingual |
| **Total** | **30** | |

## Notes

- All text files use UTF-8 encoding
- Ground truth text is the expected OCR output
- Thai numerals (๑๒๓) and Arabic numerals (123) may both appear
- Some samples include punctuation and special formatting
