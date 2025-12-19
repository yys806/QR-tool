import { useEffect, useRef, useState } from "react";
import About from "./components/About";
import Docs from "./components/Docs";
import Controls from "./components/Controls";
import QRCanvas, { type DotStyle, type EyeShape } from "./components/QRCanvas";
import { useQRMatrix, type ErrorCorrectionLevel } from "./hooks/useQRMatrix";

const DEFAULT_TEXT = "https://example.com";
type Page = "home" | "about" | "docs";

const App = () => {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M");
  const [dotStyle, setDotStyle] = useState<DotStyle>("rounded");
  const [foregroundColor, setForegroundColor] = useState("#1f2937");
  const [backgroundColor, setBackgroundColor] = useState("#fdf7ec");
  const [gradientEnabled, setGradientEnabled] = useState(true);
  const [gradientFrom, setGradientFrom] = useState("#0f766e");
  const [gradientTo, setGradientTo] = useState("#f97316");
  const [eyeColor, setEyeColor] = useState("#111827");
  const [eyeShape, setEyeShape] = useState<EyeShape>("square");
  const [titleText, setTitleText] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(0.22);
  const [canvasSize, setCanvasSize] = useState(520);
  const [page, setPage] = useState<Page>(() => {
    if (typeof window === "undefined") {
      return "home";
    }
    if (window.location.hash.startsWith("#about")) {
      return "about";
    }
    if (window.location.hash.startsWith("#docs")) {
      return "docs";
    }
    return "home";
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const matrix = useQRMatrix(text, errorLevel);

  useEffect(() => {
    if (page !== "home") {
      return;
    }

    const container = previewRef.current;
    if (!container) {
      return;
    }

    const updateSize = () => {
      const width = container.getBoundingClientRect().width;
      if (!width) {
        return;
      }
      const maxSize = 620;
      const minSize = 260;
      setCanvasSize(Math.max(minSize, Math.min(maxSize, width)));
    };

    updateSize();

    const supportsResizeObserver =
      typeof (window as Window & { ResizeObserver?: typeof ResizeObserver })
        .ResizeObserver === "function";

    if (supportsResizeObserver) {
      const observer = new ResizeObserver(() => updateSize());
      observer.observe(container);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [page]);

  useEffect(() => {
    const resolvePage = () => {
      if (window.location.hash.startsWith("#about")) {
        return "about";
      }
      if (window.location.hash.startsWith("#docs")) {
        return "docs";
      }
      return "home";
    };

    setPage(resolvePage());
    const handleHashChange = () => setPage(resolvePage());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (logoDataUrl && errorLevel !== "H") {
      setErrorLevel("H");
    }
  }, [logoDataUrl, errorLevel]);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-qr.png";
    link.click();
  };

  const handleNavigate = (next: Page) => {
    setPage(next);
    if (typeof window !== "undefined") {
      const hash = next === "home" ? "" : next;
      window.location.hash = hash;
    }
  };

  const handleOpenGuide = () => {
    setPage("docs");
    if (typeof window !== "undefined") {
      window.location.hash = "docs/quick-start";
    }
  };

  const navButtonClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
        : "text-slate-700 hover:bg-white/80"
    }`;

  return (
    <div className="min-h-screen text-slate-900">
      <header className="mx-auto w-full max-w-full px-6 pt-6 lg:max-w-[75vw]">
        <div className="grid items-center gap-4 md:grid-cols-3">
          <nav className="flex items-center gap-1 justify-self-start rounded-full border border-white/70 bg-white/70 p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => handleNavigate("home")}
              className={navButtonClass(page === "home")}
              aria-current={page === "home" ? "page" : undefined}
            >
              主页
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("about")}
              className={navButtonClass(page === "about")}
              aria-current={page === "about" ? "page" : undefined}
            >
              关于
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("docs")}
              className={navButtonClass(page === "docs")}
              aria-current={page === "docs" ? "page" : undefined}
            >
              文档
            </button>
          </nav>

          <div className="flex items-center justify-center gap-3 md:col-start-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-900/20">
              QR
            </div>
            <p className="font-display text-xl font-semibold text-slate-900">
              二维码生成小工具
            </p>
          </div>

          <div className="hidden md:block" />
        </div>
      </header>

      {page === "home" ? (
        <div className="mx-auto flex max-w-full flex-col gap-6 px-6 pb-10 pt-6 lg:max-w-[75vw] lg:flex-row">
          <aside className="w-full lg:max-w-[360px]">
            <Controls
              text={text}
              onTextChange={setText}
              titleText={titleText}
              onTitleTextChange={setTitleText}
              errorLevel={errorLevel}
              onErrorLevelChange={setErrorLevel}
              dotStyle={dotStyle}
              onDotStyleChange={setDotStyle}
              foregroundColor={foregroundColor}
              onForegroundColorChange={setForegroundColor}
              backgroundColor={backgroundColor}
              onBackgroundColorChange={setBackgroundColor}
              gradientEnabled={gradientEnabled}
              onGradientEnabledChange={setGradientEnabled}
              gradientFrom={gradientFrom}
              onGradientFromChange={setGradientFrom}
              gradientTo={gradientTo}
              onGradientToChange={setGradientTo}
              eyeColor={eyeColor}
              onEyeColorChange={setEyeColor}
              eyeShape={eyeShape}
              onEyeShapeChange={setEyeShape}
              logoDataUrl={logoDataUrl}
              onLogoUpload={handleLogoUpload}
              onLogoClear={() => setLogoDataUrl(null)}
              logoScale={logoScale}
              onLogoScaleChange={setLogoScale}
            />
          </aside>

          <main className="flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-[640px] rounded-[32px] border border-white/70 bg-white/60 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    画布预览
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-semibold text-slate-900">
                    打造可扫描的风格化二维码
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    请保持对比度并留出边距以保证可扫描性。
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-xs text-slate-600">
                    矩阵尺寸：{matrix.length || "--"} x {matrix.length || "--"}
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenGuide}
                    className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    使用说明
                  </button>
                </div>
              </div>

              <div ref={previewRef} className="mt-6 flex items-center justify-center">
                <QRCanvas
                  matrix={matrix}
                  size={canvasSize}
                  foregroundColor={foregroundColor}
                  backgroundColor={backgroundColor}
                  gradientEnabled={gradientEnabled}
                  gradientFrom={gradientFrom}
                  gradientTo={gradientTo}
                  dotStyle={dotStyle}
                  eyeColor={eyeColor}
                  eyeShape={eyeShape}
                  titleText={titleText}
                  logoDataUrl={logoDataUrl}
                  logoScale={logoScale}
                  canvasRef={canvasRef}
                />
              </div>

              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full max-w-[360px] rounded-2xl bg-slate-900 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  下载 PNG
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              提示：Logo 覆盖较多模块时请切换到 H 级。
            </div>
          </main>
        </div>
      ) : page === "about" ? (
        <About />
      ) : (
        <Docs />
      )}
    </div>
  );
};

export default App;
