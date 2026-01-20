# MaxOCR 🇹🇭

> Thai OCR powered by Typhoon - แปลงภาพเป็นข้อความไทย

[![Thai Language](https://img.shields.io/badge/language-Thai-blue)](https://github.com/panya30/MaxOCR)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- 📄 **Multi-page PDF** - Process entire documents
- 📦 **Batch Upload** - Multiple files at once
- ✍️ **Handwriting Support** - Thai handwriting recognition
- 🔒 **Privacy-first** - Local processing option
- 🎨 **Thai-optimized UI** - Beautiful Thai interface

## Quick Start

```bash
# Clone
git clone https://github.com/panya30/MaxOCR.git
cd MaxOCR

# Install
bun install

# Setup environment
cp .env.example .env.local
# Add your TYPHOON_API_KEY

# Run
bun dev
```

## OCR Modes

| Mode | Speed | Accuracy | Use Case |
|------|-------|----------|----------|
| **v1.5** | ⚡ Fast | Good | Quick scans |
| **default** | Medium | Better | General use |
| **structure** | Slow | Best | Complex layouts |

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **OCR**: Typhoon API, Ollama (local)
- **PDF**: pdf.js, react-pdf

## Development

```bash
bun dev          # Start dev server
bun build        # Production build
bun test         # Run tests
bun test:ocr     # OCR accuracy tests
```

## API Usage

```typescript
// POST /api/ocr
const response = await fetch('/api/ocr', {
  method: 'POST',
  body: JSON.stringify({
    image: base64Image,
    mode: 'default',
    language: 'th'
  })
});

const { text, metadata } = await response.json();
```

## Contributing

Built by the Panya Council:
- **ATHENA** - Director
- **HEPHAESTUS** - Development
- **ARGUS** - Testing
- **APOLLO** - UX/Product

## License

MIT License - see [LICENSE](LICENSE)

---

Made with 💜 by [Panya Council](https://github.com/panya30)
