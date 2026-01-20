# MaxOCR - Thai OCR Platform

> แปลงภาพเป็นข้อความไทย ด้วย AI

## Project Info

- **Repo**: https://github.com/panya30/MaxOCR
- **Stack**: Next.js 14 + TypeScript + Tailwind + shadcn/ui
- **PRD**: `~/120/Apps/X/docs/PRD-MaxOCR.md`
- **Hub**: `~/120/Apps/X/` (Panya Council home)

---

## Panya Council

This project is built by the Panya Council:

| Panya | Role | Label |
|-------|------|-------|
| **ATHENA** | Director - coordinates, prioritizes | `panya:athena` |
| **HEPHAESTUS** | Dev - code, architecture | `panya:hephaestus` |
| **ARGUS** | Test - QA, accuracy | `panya:argus` |
| **APOLLO** | Product - UX, Thai domain | `panya:apollo` |

---

## Golden Rules

1. **Thai-first** - UI และ UX ต้องเหมาะกับภาษาไทย
2. **Privacy-first** - Local processing option เสมอ
3. **Test accuracy** - ต้องมี benchmark ก่อน ship
4. **No API key in code** - ใช้ env vars เท่านั้น

---

## Commands

```bash
# Development
bun dev          # Start dev server
bun build        # Build for production
bun test         # Run tests
bun test:ocr     # Run OCR accuracy tests

# Panya workflow
/ralph-loop "Build feature X" --completion-promise 'DONE'
```

---

## Directory Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/ocr/           # OCR API endpoint
│   ├── api/batch/         # Batch processing
│   └── api/export/        # Export endpoint
├── components/
│   ├── upload/            # Upload components
│   ├── preview/           # Document preview
│   └── editor/            # Text editor
├── lib/
│   ├── ocr/               # OCR providers
│   ├── preprocessing/     # Image processing
│   └── export/            # Export formats
└── types/

tests/
├── datasets/              # Thai test images
│   ├── printed/
│   ├── handwriting/
│   └── mixed/
└── accuracy/              # Accuracy benchmarks
```

---

## Environment Variables

```bash
# .env.local
TYPHOON_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## References

- Typhoon OCR learnings: `~/120/Apps/X/ψ/learn/typhoon-ocr/`
- Existing prototype: `~/120/Apps/X/ψ/lab/typhoon-ocr-app/`

---

*Managed by Panya Council*
