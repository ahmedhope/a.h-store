const hexToName: Record<string, string> = {
  "#000000": "أسود",
  "#ffffff": "أبيض",
  "#ff0000": "أحمر",
  "#cc0000": "أحمر غامق",
  "#00ff00": "أخضر",
  "#008000": "أخضر غامق",
  "#0000ff": "أزرق",
  "#00008b": "أزرق غامق",
  "#ffff00": "أصفر",
  "#ffa500": "برتقالي",
  "#ff6600": "برتقالي غامق",
  "#800080": "بنفسجي",
  "#ee82ee": "بنفسجي فاتح",
  "#ffc0cb": "وردي",
  "#ff69b4": "وردي فاتح",
  "#a52a2a": "بني",
  "#8b4513": "بني غامق",
  "#808080": "رمادي",
  "#c0c0c0": "رمادي فاتح",
  "#d3d3d3": "رمادي فاتح جداً",
  "#e0e0e0": "رمادي فاتح جداً",
  "#f5f5f5": "أبيض رملي",
  "#00ffff": "سماوي",
  "#008080": "سماوي غامق",
  "#ff00ff": "فوشيا",
  "#e6e6fa": "خزامي",
  "#f0e68c": "كاكي",
  "#ffe4b5": "بيج",
  "#f5f5dc": "بيج فاتح",
  "#faebd7": "عاجي",
  "#2f4f4f": "رمادي داكن جداً",
  "#1a1a1a": "أسود داكن",
  "#333333": "رمادي غامق",
  "#666666": "رمادي متوسط",
  "#999999": "رمادي",
  "#cccccc": "رمادي فاتح",
  "#990000": "أحمر داكن",
  "#006400": "أخضر داكن",
  "#191970": "أزرق داكن",
  "#4b0082": "نيلي",
  "#8b008b": "أرجواني داكن",
  "#556b2f": "زيتوني داكن",
  "#8b0000": "أحمر داكن جداً",
  "#b22222": "أحمر قرميدي",
  "#dc143c": "قرمزي",
  "#ff4500": "برتقالي محمر",
  "#ff8c00": "برتقالي داكن",
  "#ffd700": "ذهبي",
  "#b8860b": "ذهبي داكن",
  "#daa520": "ذهبي متوسط",
  "#2e8b57": "أخضر بحري",
  "#3cb371": "أخضر بحري متوسط",
  "#20b2aa": "أخضر بحري فاتح",
  "#48d1cc": "تركواز متوسط",
  "#40e0d0": "تركواز",
  "#00ced1": "تركواز داكن",
  "#6495ed": "أزرق فاتح",
  "#4169e1": "أزرق ملكي",
  "#6a5acd": "أزرق أردوازي",
  "#7b68ee": "أزرق أردوازي متوسط",
  "#9370db": "أرجواني متوسط",
  "#8a2be2": "أزرق بنفسجي",
  "#ba55d3": "أرجواني متوسط",
  "#dda0dd": "برقوقي",
  "#ff1493": "وردي عميق",
};

export interface ColorInfo {
  name: string;
  hex: string;
}

export function parseColor(raw: unknown): ColorInfo {
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const hex = typeof obj.hex === "string" && obj.hex.startsWith("#") ? obj.hex : "#888888";
    const name = typeof obj.name === "string" && obj.name ? obj.name : hex;
    return { name, hex };
  }
  const str = String(raw || "");
  if (str.startsWith("#")) {
    const key = str.toLowerCase();
    return { name: hexToName[key] || str, hex: str };
  }
  return { name: str, hex: "#888888" };
}

export function parseColors(raw: string | null | undefined): ColorInfo[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseColor);
  } catch {
    return [];
  }
}

export function getColorName(raw: unknown): string {
  return parseColor(raw).name;
}
