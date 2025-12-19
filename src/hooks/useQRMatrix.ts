import { useMemo } from "react";
import QRCode from "qrcode";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export const useQRMatrix = (value: string, level: ErrorCorrectionLevel) => {
  return useMemo(() => {
    const content = value.trim().length ? value : " ";

    try {
      const qr = QRCode.create(content, { errorCorrectionLevel: level });
      const { size, data } = qr.modules;
      const matrix: number[][] = [];

      for (let row = 0; row < size; row += 1) {
        const line: number[] = [];
        for (let col = 0; col < size; col += 1) {
          line.push(data[row * size + col] ? 1 : 0);
        }
        matrix.push(line);
      }

      return matrix;
    } catch (error) {
      console.error("QR matrix generation failed", error);
      return [];
    }
  }, [value, level]);
};
