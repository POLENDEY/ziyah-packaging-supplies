export type ColorPreset = {
  id: string;
  label: string;
  color: string;
  colorHex: string;
  colorHexSecondary?: string;
};

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "clear", label: "Clear", color: "Clear", colorHex: "#dce8ef" },
  { id: "black", label: "Black", color: "Black", colorHex: "#1c141f" },
  { id: "red", label: "Red", color: "Red", colorHex: "#e53935" },
  {
    id: "red-black",
    label: "Red & Black",
    color: "Red & Black",
    colorHex: "#e53935",
    colorHexSecondary: "#1c141f",
  },
  { id: "white", label: "White", color: "White", colorHex: "#ffffff" },
];

export function normalizeHex(raw: string, fallback = "#cccccc"): string {
  const t = raw.trim();
  if (!t) return fallback;
  const withHash = t.startsWith("#") ? t : `#${t}`;
  return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash.toLowerCase() : fallback;
}
