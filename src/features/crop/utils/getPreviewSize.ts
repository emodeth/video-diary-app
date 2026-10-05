export function getPreviewSize(
  width: number,
  height: number,
  topInset: number,
  bottomInset: number,
) {
  const previewWidth = Math.min(width, 620) - 54;
  const sheetHeight = Math.min(height * 0.91, height - topInset - 12);
  const cardHeight = Math.max(
    292,
    sheetHeight - 96 - (70 + Math.max(bottomInset, 16)) - 292,
  );

  return { previewWidth, cardHeight, mediaHeight: cardHeight - 52 };
}
