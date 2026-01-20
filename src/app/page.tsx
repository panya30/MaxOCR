export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-gold/20">
            🔮
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight bg-gradient-to-r from-gold to-gold/80 bg-clip-text text-transparent">
            MaxOCR
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          แปลงภาพเป็นข้อความไทย ด้วย AI
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Upload Card */}
        <div className="bg-card border border-border rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center text-xl">
              📄
            </div>
            <h2 className="text-xl font-semibold">อัปโหลดไฟล์</h2>
          </div>

          {/* Upload Zone Placeholder */}
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-muted/30 hover:border-gold/40 hover:bg-gold/5 transition-all cursor-pointer">
            <div className="text-4xl mb-4 opacity-60">📁</div>
            <p className="text-muted-foreground mb-2">
              ลากไฟล์มาวางที่นี่ หรือ{" "}
              <span className="text-gold">คลิกเพื่อเลือก</span>
            </p>
            <p className="text-sm text-muted-foreground/60">
              รองรับ PDF, PNG, JPG, WEBP
            </p>
          </div>

          <button
            disabled
            className="w-full mt-6 py-4 bg-gradient-to-r from-gold to-gold/90 text-background font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 transition-all"
          >
            🔍 แปลงเป็นข้อความ
          </button>
        </div>

        {/* Result Card */}
        <div className="bg-card border border-border rounded-3xl p-8 min-h-[400px] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-teal/15 text-teal flex items-center justify-center text-xl">
              📋
            </div>
            <h2 className="text-xl font-semibold">ผลลัพธ์</h2>
          </div>

          {/* Placeholder */}
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center">
            <div className="text-5xl mb-4 opacity-30">🔮</div>
            <p>อัปโหลดไฟล์เพื่อเริ่มแปลงข้อความ</p>
            <p className="text-sm mt-2 text-muted-foreground/60">
              รองรับทั้งเอกสาร ลายมือ และตาราง
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
        <p>
          Powered by{" "}
          <a
            href="https://github.com/scb-10x/typhoon-ocr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            Typhoon OCR
          </a>{" "}
          by SCB 10X
        </p>
      </footer>
    </div>
  );
}
