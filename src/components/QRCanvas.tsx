import { useEffect, useState, type RefObject } from "react";

export type DotStyle = "square" | "dot" | "rounded" | "liquid";
export type EyeShape = "square" | "circle";

type QRCanvasProps = {
  matrix: number[][];
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  gradientEnabled: boolean;
  gradientFrom: string;
  gradientTo: string;
  dotStyle: DotStyle;
  eyeColor: string;
  eyeShape: EyeShape;
  titleText: string;
  logoDataUrl: string | null;
  logoScale: number;
  canvasRef: RefObject<HTMLCanvasElement>;
};

const QUIET_ZONE = 4;
const EYE_SIZE = 7;

const isInEye = (row: number, col: number, size: number) => {
  const topLeft = row < EYE_SIZE && col < EYE_SIZE;
  const topRight = row < EYE_SIZE && col >= size - EYE_SIZE;
  const bottomLeft = row >= size - EYE_SIZE && col < EYE_SIZE;
  return topLeft || topRight || bottomLeft;
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  ctx.fill();
};

const drawEye = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  moduleSize: number,
  eyeShape: EyeShape,
  eyeColor: string,
  backgroundColor: string
) => {
  const outerSize = EYE_SIZE * moduleSize;
  const innerSize = 5 * moduleSize;
  const coreSize = 3 * moduleSize;

  if (eyeShape === "circle") {
    const centerX = x + outerSize / 2;
    const centerY = y + outerSize / 2;

    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillStyle = eyeColor;
  ctx.fillRect(x, y, outerSize, outerSize);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x + moduleSize, y + moduleSize, innerSize, innerSize);
  ctx.fillStyle = eyeColor;
  ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, coreSize, coreSize);
};

const drawLogo = (
  ctx: CanvasRenderingContext2D,
  size: number,
  logoImage: HTMLImageElement,
  logoScale: number,
  backgroundColor: string,
  offsetY: number
) => {
  const logoSize = size * logoScale;
  const x = (size - logoSize) / 2;
  const y = offsetY + (size - logoSize) / 2;
  const padding = logoSize * 0.08;
  const radius = logoSize * 0.12;

  ctx.fillStyle = backgroundColor;
  drawRoundedRect(
    ctx,
    x - padding,
    y - padding,
    logoSize + padding * 2,
    logoSize + padding * 2,
    radius
  );

  ctx.drawImage(logoImage, x, y, logoSize, logoSize);
};

const QRCanvas = ({
  matrix,
  size,
  foregroundColor,
  backgroundColor,
  gradientEnabled,
  gradientFrom,
  gradientTo,
  dotStyle,
  eyeColor,
  eyeShape,
  titleText,
  logoDataUrl,
  logoScale,
  canvasRef
}: QRCanvasProps) => {
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!logoDataUrl) {
      setLogoImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => setLogoImage(img);
    img.src = logoDataUrl;

    return () => {
      img.onload = null;
    };
  }, [logoDataUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const title = titleText.trim();
    const titleFontSize = Math.max(18, Math.round(size * 0.06));
    const titleTop = title ? Math.round(titleFontSize * 0.5) : 0;
    const titleSpacing = title ? Math.round(titleFontSize * 0.7) : 0;
    const qrOffsetY = title ? titleTop + titleFontSize + titleSpacing : 0;
    const canvasHeight = size + qrOffsetY;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = size * ratio;
    canvas.height = canvasHeight * ratio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${canvasHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size, canvasHeight);
    context.imageSmoothingEnabled = true;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, size, canvasHeight);

    if (title) {
      context.fillStyle = foregroundColor;
      context.font = `600 ${titleFontSize}px "Space Grotesk", "DM Sans", sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(title, size / 2, titleTop);
    }

    if (!matrix.length) {
      context.fillStyle = "#64748b";
      context.font = "16px DM Sans, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("请输入内容以生成二维码。", size / 2, qrOffsetY + size / 2);
      return;
    }

    const moduleSize = size / (matrix.length + QUIET_ZONE * 2);
    const offset = QUIET_ZONE * moduleSize;
    const offsetY = qrOffsetY + offset;
    const gradient = gradientEnabled
      ? context.createLinearGradient(0, 0, size, size)
      : null;

    if (gradient) {
      gradient.addColorStop(0, gradientFrom);
      gradient.addColorStop(1, gradientTo);
    }

    context.fillStyle = gradient ?? foregroundColor;

    const isDarkModule = (row: number, col: number) =>
      matrix[row]?.[col] === 1 && !isInEye(row, col, matrix.length);

    for (let row = 0; row < matrix.length; row += 1) {
      for (let col = 0; col < matrix[row].length; col += 1) {
        if (!isDarkModule(row, col)) {
          continue;
        }

        const x = offset + col * moduleSize;
        const y = offsetY + row * moduleSize;

        if (dotStyle === "square") {
          context.fillRect(x, y, moduleSize, moduleSize);
          continue;
        }

        if (dotStyle === "rounded") {
          drawRoundedRect(
            context,
            x,
            y,
            moduleSize,
            moduleSize,
            moduleSize * 0.28
          );
          continue;
        }

        if (dotStyle === "dot") {
          context.beginPath();
          context.arc(
            x + moduleSize / 2,
            y + moduleSize / 2,
            moduleSize * 0.45,
            0,
            Math.PI * 2
          );
          context.fill();
          continue;
        }

        const radius = moduleSize * 0.5;
        const band = moduleSize * 0.6;
        const bandOffset = (moduleSize - band) / 2;

        context.beginPath();
        context.arc(
          x + moduleSize / 2,
          y + moduleSize / 2,
          radius * 0.9,
          0,
          Math.PI * 2
        );
        context.fill();

        if (isDarkModule(row, col + 1)) {
          context.fillRect(x + moduleSize / 2, y + bandOffset, moduleSize, band);
        }

        if (isDarkModule(row + 1, col)) {
          context.fillRect(x + bandOffset, y + moduleSize / 2, band, moduleSize);
        }
      }
    }

    const eyeOffset = offset;
    const eyeOffsetY = qrOffsetY + offset;
    const eyePositions = [
      { x: eyeOffset, y: eyeOffsetY },
      {
        x: eyeOffset + (matrix.length - EYE_SIZE) * moduleSize,
        y: eyeOffsetY
      },
      {
        x: eyeOffset,
        y: eyeOffsetY + (matrix.length - EYE_SIZE) * moduleSize
      }
    ];

    eyePositions.forEach((position) =>
      drawEye(
        context,
        position.x,
        position.y,
        moduleSize,
        eyeShape,
        eyeColor,
        backgroundColor
      )
    );

    if (logoImage) {
      drawLogo(context, size, logoImage, logoScale, backgroundColor, qrOffsetY);
    }
  }, [
    matrix,
    size,
    foregroundColor,
    backgroundColor,
    gradientEnabled,
    gradientFrom,
    gradientTo,
    dotStyle,
    eyeColor,
    eyeShape,
    titleText,
    logoImage,
    logoScale,
    canvasRef
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-3xl border border-white/70 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.15)]"
    />
  );
};

export default QRCanvas;
