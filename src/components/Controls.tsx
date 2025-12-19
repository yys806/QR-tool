import type { ChangeEvent } from "react";
import type { ErrorCorrectionLevel } from "../hooks/useQRMatrix";
import type { DotStyle, EyeShape } from "./QRCanvas";

type ControlsProps = {
  text: string;
  onTextChange: (value: string) => void;
  titleText: string;
  onTitleTextChange: (value: string) => void;
  errorLevel: ErrorCorrectionLevel;
  onErrorLevelChange: (value: ErrorCorrectionLevel) => void;
  dotStyle: DotStyle;
  onDotStyleChange: (value: DotStyle) => void;
  foregroundColor: string;
  onForegroundColorChange: (value: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: (value: string) => void;
  gradientEnabled: boolean;
  onGradientEnabledChange: (value: boolean) => void;
  gradientFrom: string;
  onGradientFromChange: (value: string) => void;
  gradientTo: string;
  onGradientToChange: (value: string) => void;
  eyeColor: string;
  onEyeColorChange: (value: string) => void;
  eyeShape: EyeShape;
  onEyeShapeChange: (value: EyeShape) => void;
  logoDataUrl: string | null;
  onLogoUpload: (file: File) => void;
  onLogoClear: () => void;
  logoScale: number;
  onLogoScaleChange: (value: number) => void;
};

const Controls = ({
  text,
  onTextChange,
  titleText,
  onTitleTextChange,
  errorLevel,
  onErrorLevelChange,
  dotStyle,
  onDotStyleChange,
  foregroundColor,
  onForegroundColorChange,
  backgroundColor,
  onBackgroundColorChange,
  gradientEnabled,
  onGradientEnabledChange,
  gradientFrom,
  onGradientFromChange,
  gradientTo,
  onGradientToChange,
  eyeColor,
  onEyeColorChange,
  eyeShape,
  onEyeShapeChange,
  logoDataUrl,
  onLogoUpload,
  onLogoClear,
  logoScale,
  onLogoScaleChange
}: ControlsProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLogoUpload(file);
    }
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          定制美学 QR
        </p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-slate-900">
          画布二维码生成器
        </h1>
        <p className="mt-3 text-base font-medium text-slate-700">
          用自定义形状、渐变和居中 Logo 设计二维码。
        </p>
      </div>

      <details className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm" open>
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
          内容
        </summary>
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <label className="flex flex-col gap-2">
            <span className="font-medium text-slate-800">URL 或文本</span>
            <textarea
              rows={3}
              value={text}
              onChange={(event) => onTextChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
              placeholder="https://example.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-medium text-slate-800">顶部文字</span>
            <input
              type="text"
              value={titleText}
              onChange={(event) => onTitleTextChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
              placeholder="可选：输入二维码标题"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-medium text-slate-800">纠错等级</span>
            <select
              value={errorLevel}
              onChange={(event) =>
                onErrorLevelChange(event.target.value as ErrorCorrectionLevel)
              }
              className="w-full rounded-xl border border-slate-200 bg-white/80 p-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
            >
              <option value="L">L - 低</option>
              <option value="M">M - 中</option>
              <option value="Q">Q - 较高</option>
              <option value="H">H - 高</option>
            </select>
            <span className="text-xs text-slate-500">
              添加 Logo 时建议使用 H 级。
            </span>
          </label>
        </div>
      </details>

      <details className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
          模块
        </summary>
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <label className="flex flex-col gap-2">
            <span className="font-medium text-slate-800">模块形状</span>
            <select
              value={dotStyle}
              onChange={(event) => onDotStyleChange(event.target.value as DotStyle)}
              className="w-full rounded-xl border border-slate-200 bg-white/80 p-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
            >
              <option value="square">方块</option>
              <option value="dot">圆点</option>
              <option value="rounded">圆角</option>
              <option value="liquid">液态</option>
            </select>
          </label>

          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-slate-800">前景色</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={foregroundColor}
                onChange={(event) => onForegroundColorChange(event.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(event) => onForegroundColorChange(event.target.value)}
                className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs uppercase tracking-wide"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-slate-800">背景色</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => onBackgroundColorChange(event.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(event) => onBackgroundColorChange(event.target.value)}
                className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs uppercase tracking-wide"
              />
            </div>
          </div>

          <label className="flex items-center justify-between gap-3">
            <span className="font-medium text-slate-800">渐变填充</span>
            <input
              type="checkbox"
              checked={gradientEnabled}
              onChange={(event) => onGradientEnabledChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                渐变起点
              </span>
              <input
                type="color"
                value={gradientFrom}
                onChange={(event) => onGradientFromChange(event.target.value)}
                disabled={!gradientEnabled}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                渐变终点
              </span>
              <input
                type="color"
                value={gradientTo}
                onChange={(event) => onGradientToChange(event.target.value)}
                disabled={!gradientEnabled}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
        </div>
      </details>

      <details className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
          定位图
        </summary>
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-slate-800">定位图颜色</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={eyeColor}
                onChange={(event) => onEyeColorChange(event.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                value={eyeColor}
                onChange={(event) => onEyeColorChange(event.target.value)}
                className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs uppercase tracking-wide"
              />
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-medium text-slate-800">定位图形状</span>
            <select
              value={eyeShape}
              onChange={(event) => onEyeShapeChange(event.target.value as EyeShape)}
              className="w-full rounded-xl border border-slate-200 bg-white/80 p-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
            >
              <option value="square">方形</option>
              <option value="circle">圆形</option>
            </select>
          </label>
        </div>
      </details>

      <details className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
          Logo
        </summary>
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-white/80 p-3 text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Logo 大小
              </span>
              <span className="text-xs text-slate-600">
                {(logoScale * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.12}
              max={0.32}
              step={0.01}
              value={logoScale}
              onChange={(event) => onLogoScaleChange(Number(event.target.value))}
              disabled={!logoDataUrl}
              className="w-full accent-slate-900 disabled:opacity-40"
            />
          </div>

          {logoDataUrl ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 p-2">
              <img
                src={logoDataUrl}
                alt="Logo 预览"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={onLogoClear}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-400"
              >
                移除
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              上传 Logo 以置于二维码中心。
            </p>
          )}
        </div>
      </details>

    </div>
  );
};

export default Controls;
