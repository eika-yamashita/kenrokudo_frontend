export const normalizeIdInput = (value: string | null | undefined): string => {
  const trimmed = (value ?? '').trim();

  return trimmed
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0)
    )
    .toUpperCase();
};
