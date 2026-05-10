export const imageThemes = {
  technology:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
  workspace:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
  nature:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  city:
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
};

export const defaultState = {
  opacity: 0.28,
  blur: 18,
  saturation: 140,
  outline: 1.2,
  colorInput: 'rgba(255, 255, 255, 0.28)',
  colorPicker: '#ffffff',
  backgroundType: 'gradient',
  gradientStart: '#0f172a',
  gradientEnd: '#7c3aed',
  gradientAngle: 135,
  solidColor: '#1e293b',
  imageTheme: 'technology',
};

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function componentToHex(component) {
  return component.toString(16).padStart(2, '0');
}

export function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function isHexColor(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function parseRgbString(value) {
  const match = value
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i);

  if (!match) {
    return null;
  }

  const red = clamp(Number(match[1]), 0, 255);
  const green = clamp(Number(match[2]), 0, 255);
  const blue = clamp(Number(match[3]), 0, 255);
  const alpha = match[4] === undefined ? null : clamp(Number(match[4]), 0, 1);

  return { red, green, blue, alpha };
}

export function hexToRgb(hex) {
  const normalized = hex.replace('#', '').trim();
  const expanded = normalized.length === 3
    ? normalized
        .split('')
        .map((char) => char + char)
        .join('')
    : normalized;

  const red = parseInt(expanded.slice(0, 2), 16);
  const green = parseInt(expanded.slice(2, 4), 16);
  const blue = parseInt(expanded.slice(4, 6), 16);

  return { red, green, blue };
}

export function formatRgba({ red, green, blue, alpha }, fallbackOpacity) {
  const resolvedAlpha = alpha === null || Number.isNaN(alpha) ? fallbackOpacity : alpha;
  return `rgba(${red}, ${green}, ${blue}, ${resolvedAlpha.toFixed(2)})`;
}

export function normalizeGlassColor(state) {
  const raw = state.colorInput.trim();

  if (isHexColor(raw)) {
    state.colorPicker = raw.length === 4
      ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
      : raw;
    const { red, green, blue } = hexToRgb(state.colorPicker);
    return formatRgba({ red, green, blue, alpha: state.opacity }, state.opacity);
  }

  const parsedRgb = parseRgbString(raw);
  if (parsedRgb) {
    state.colorPicker = rgbToHex(parsedRgb.red, parsedRgb.green, parsedRgb.blue);
    return formatRgba(parsedRgb, state.opacity);
  }

  const { red, green, blue } = hexToRgb(state.colorPicker);
  state.colorInput = formatRgba({ red, green, blue, alpha: state.opacity }, state.opacity);
  return state.colorInput;
}

export function getOutlineColor(state) {
  const parsedRgb = parseRgbString(normalizeGlassColor(state));
  if (!parsedRgb) {
    return 'rgba(255, 255, 255, 0.35)';
  }

  return `rgba(${parsedRgb.red}, ${parsedRgb.green}, ${parsedRgb.blue}, 0.32)`;
}

export function getPreviewBackground(state) {
  if (state.backgroundType === 'solid') {
    return state.solidColor;
  }

  if (state.backgroundType === 'image') {
    const imageUrl = imageThemes[state.imageTheme] || imageThemes.technology;
    return `linear-gradient(180deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.3)), url(${imageUrl})`;
  }

  return `linear-gradient(${state.gradientAngle}deg, ${state.gradientStart}, ${state.gradientEnd})`;
}

export function generateCssSnippet(state) {
  const glassColor = normalizeGlassColor(state);
  return `.glass-effect {\n  background: ${glassColor};\n  border: ${Number(state.outline).toFixed(1)}px solid ${getOutlineColor(state)};\n  backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);\n  -webkit-backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);\n  border-radius: 32px;\n  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.35);\n}`;
}
