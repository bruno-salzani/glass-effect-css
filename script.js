const imageThemes = {
  technology:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
  workspace:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
  nature:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  city:
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
};

const state = {
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

const elements = {
  opacityRange: document.getElementById('opacityRange'),
  blurRange: document.getElementById('blurRange'),
  saturationRange: document.getElementById('saturationRange'),
  outlineRange: document.getElementById('outlineRange'),
  colorPicker: document.getElementById('colorPicker'),
  colorInput: document.getElementById('colorInput'),
  backgroundType: document.getElementById('backgroundType'),
  gradientStart: document.getElementById('gradientStart'),
  gradientEnd: document.getElementById('gradientEnd'),
  gradientAngle: document.getElementById('gradientAngle'),
  solidColor: document.getElementById('solidColor'),
  imageTheme: document.getElementById('imageTheme'),
  previewStage: document.getElementById('previewStage'),
  glassCard: document.getElementById('glassCard'),
  cssOutput: document.getElementById('cssOutput'),
  copyButton: document.getElementById('copyButton'),
  copyButtonLabel: document.getElementById('copyButtonLabel'),
  opacityValue: document.getElementById('opacityValue'),
  blurValue: document.getElementById('blurValue'),
  saturationValue: document.getElementById('saturationValue'),
  outlineValue: document.getElementById('outlineValue'),
  gradientAngleValue: document.getElementById('gradientAngleValue'),
  gradientControls: document.getElementById('gradientControls'),
  solidControls: document.getElementById('solidControls'),
  imageControls: document.getElementById('imageControls'),
  adSlots: Array.from(document.querySelectorAll('.ad-slot')),
};

const sliderMap = [
  ['opacityRange', 'opacity'],
  ['blurRange', 'blur'],
  ['saturationRange', 'saturation'],
  ['outlineRange', 'outline'],
  ['gradientAngle', 'gradientAngle'],
];

const inputMap = [
  ['colorPicker', 'colorPicker'],
  ['colorInput', 'colorInput'],
  ['backgroundType', 'backgroundType'],
  ['gradientStart', 'gradientStart'],
  ['gradientEnd', 'gradientEnd'],
  ['solidColor', 'solidColor'],
  ['imageTheme', 'imageTheme'],
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function componentToHex(component) {
  return component.toString(16).padStart(2, '0');
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function isHexColor(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

function parseRgbString(value) {
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

function hexToRgb(hex) {
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

function formatRgba({ red, green, blue, alpha }) {
  const resolvedAlpha = alpha === null || Number.isNaN(alpha) ? state.opacity : alpha;
  return `rgba(${red}, ${green}, ${blue}, ${resolvedAlpha.toFixed(2)})`;
}

function normalizeGlassColor() {
  const raw = state.colorInput.trim();

  if (isHexColor(raw)) {
    state.colorPicker = raw.length === 4
      ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
      : raw;
    const { red, green, blue } = hexToRgb(state.colorPicker);
    return formatRgba({ red, green, blue, alpha: state.opacity });
  }

  const parsedRgb = parseRgbString(raw);
  if (parsedRgb) {
    state.colorPicker = rgbToHex(parsedRgb.red, parsedRgb.green, parsedRgb.blue);
    return formatRgba(parsedRgb);
  }

  const { red, green, blue } = hexToRgb(state.colorPicker);
  state.colorInput = formatRgba({ red, green, blue, alpha: state.opacity });
  return state.colorInput;
}

function getOutlineColor() {
  const parsedRgb = parseRgbString(normalizeGlassColor());
  if (!parsedRgb) {
    return 'rgba(255, 255, 255, 0.35)';
  }

  return `rgba(${parsedRgb.red}, ${parsedRgb.green}, ${parsedRgb.blue}, 0.32)`;
}

function getPreviewBackground() {
  if (state.backgroundType === 'solid') {
    return state.solidColor;
  }

  if (state.backgroundType === 'image') {
    const imageUrl = imageThemes[state.imageTheme] || imageThemes.technology;
    return `linear-gradient(180deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.3)), url(${imageUrl})`;
  }

  return `linear-gradient(${state.gradientAngle}deg, ${state.gradientStart}, ${state.gradientEnd})`;
}

function toggleBackgroundPanels() {
  elements.gradientControls.classList.toggle('hidden', state.backgroundType !== 'gradient');
  elements.solidControls.classList.toggle('hidden', state.backgroundType !== 'solid');
  elements.imageControls.classList.toggle('hidden', state.backgroundType !== 'image');
}

function updateValueLabels() {
  elements.opacityValue.textContent = `${Number(state.opacity).toFixed(2)}`;
  elements.blurValue.textContent = `${state.blur}px`;
  elements.saturationValue.textContent = `${state.saturation}%`;
  elements.outlineValue.textContent = `${Number(state.outline).toFixed(1)}px`;
  elements.gradientAngleValue.textContent = `${state.gradientAngle}°`;
}

function syncInputs() {
  elements.opacityRange.value = state.opacity;
  elements.blurRange.value = state.blur;
  elements.saturationRange.value = state.saturation;
  elements.outlineRange.value = state.outline;
  elements.colorPicker.value = state.colorPicker;
  elements.colorInput.value = state.colorInput;
  elements.backgroundType.value = state.backgroundType;
  elements.gradientStart.value = state.gradientStart;
  elements.gradientEnd.value = state.gradientEnd;
  elements.gradientAngle.value = state.gradientAngle;
  elements.solidColor.value = state.solidColor;
  elements.imageTheme.value = state.imageTheme;
}

function updatePreview() {
  const glassColor = normalizeGlassColor();
  state.colorInput = glassColor;
  syncInputs();
  updateValueLabels();
  toggleBackgroundPanels();

  elements.previewStage.style.background = getPreviewBackground();
  elements.previewStage.style.backgroundSize = state.backgroundType === 'image' ? 'cover' : 'auto';
  elements.previewStage.style.backgroundPosition = 'center';

  elements.glassCard.style.background = glassColor;
  elements.glassCard.style.border = `${Number(state.outline).toFixed(1)}px solid ${getOutlineColor()}`;
  elements.glassCard.style.backdropFilter = `blur(${state.blur}px) saturate(${state.saturation}%)`;
  elements.glassCard.style.webkitBackdropFilter = `blur(${state.blur}px) saturate(${state.saturation}%)`;
}

function generateCSS() {
  const glassColor = normalizeGlassColor();
  const css = `.glass-effect {\n  background: ${glassColor};\n  border: ${Number(state.outline).toFixed(1)}px solid ${getOutlineColor()};\n  backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);\n  -webkit-backdrop-filter: blur(${state.blur}px) saturate(${state.saturation}%);\n  border-radius: 32px;\n  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.35);\n}`;

  elements.cssOutput.value = css;
  return css;
}

async function copyCSS() {
  const css = generateCSS();

  try {
    await navigator.clipboard.writeText(css);
    elements.copyButton.classList.add('is-success');
    elements.copyButtonLabel.textContent = 'Copiado!';
    window.setTimeout(() => {
      elements.copyButton.classList.remove('is-success');
      elements.copyButtonLabel.textContent = 'Copiar CSS';
    }, 1800);
  } catch {
    elements.cssOutput.focus();
    elements.cssOutput.select();
    document.execCommand('copy');
    elements.copyButton.classList.add('is-success');
    elements.copyButtonLabel.textContent = 'Copiado!';
    window.setTimeout(() => {
      elements.copyButton.classList.remove('is-success');
      elements.copyButtonLabel.textContent = 'Copiar CSS';
    }, 1800);
  }
}

function bindEvents() {
  sliderMap.forEach(([elementKey, stateKey]) => {
    elements[elementKey].addEventListener('input', (event) => {
      state[stateKey] = Number(event.target.value);
      updatePreview();
      generateCSS();
    });
  });

  inputMap.forEach(([elementKey, stateKey]) => {
    const eventName = elementKey === 'colorInput' ? 'input' : 'change';
    elements[elementKey].addEventListener(eventName, (event) => {
      state[stateKey] = event.target.value;

      if (stateKey === 'colorPicker') {
        const { red, green, blue } = hexToRgb(state.colorPicker);
        state.colorInput = formatRgba({ red, green, blue, alpha: state.opacity });
      }

      updatePreview();
      generateCSS();
    });
  });

  elements.copyButton.addEventListener('click', copyCSS);
}

function initAds() {
  // Cole o script oficial do Google AdSense no <head> do index.html quando for ativar a monetização real.
  // Exemplo de integração futura: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=SEU_CLIENT_ID" crossorigin="anonymous"></script>
  // Depois substitua cada .ad-slot pelo bloco <ins class="adsbygoogle"> correspondente ao formato desejado.
  elements.adSlots.forEach((slot, index) => {
    window.setTimeout(() => {
      slot.classList.add('is-loaded');
      slot.setAttribute('data-ad-state', 'loaded');
      const badge = slot.querySelector('.ad-badge');
      if (badge) {
        badge.textContent = `${badge.textContent} • Ready`;
      }
    }, 350 + index * 180);
  });
}

function initApp() {
  syncInputs();
  toggleBackgroundPanels();
  updatePreview();
  generateCSS();
  bindEvents();
  initAds();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
