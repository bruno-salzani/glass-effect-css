import {
  defaultState,
  clamp,
  hexToRgb,
  formatRgba,
  normalizeGlassColor,
  getOutlineColor,
  getPreviewBackground,
  generateCssSnippet,
} from './src/lib/glass.js';

const state = { ...defaultState };

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
  downloadButton: document.getElementById('downloadButton'),
  resetButton: document.getElementById('resetButton'),
  opacityValue: document.getElementById('opacityValue'),
  blurValue: document.getElementById('blurValue'),
  saturationValue: document.getElementById('saturationValue'),
  outlineValue: document.getElementById('outlineValue'),
  gradientAngleValue: document.getElementById('gradientAngleValue'),
  gradientControls: document.getElementById('gradientControls'),
  solidControls: document.getElementById('solidControls'),
  imageControls: document.getElementById('imageControls'),
  adSlots: Array.from(document.querySelectorAll('.ad-shell')),
  adUnits: Array.from(document.querySelectorAll('.adsbygoogle')),
  consentBanner: document.getElementById('consentBanner'),
  acceptAdsConsent: document.getElementById('acceptAdsConsent'),
  declineAdsConsent: document.getElementById('declineAdsConsent'),
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
  const glassColor = normalizeGlassColor(state);
  state.colorInput = glassColor;
  syncInputs();
  updateValueLabels();
  toggleBackgroundPanels();

  elements.previewStage.style.background = getPreviewBackground(state);
  elements.previewStage.style.backgroundSize = state.backgroundType === 'image' ? 'cover' : 'auto';
  elements.previewStage.style.backgroundPosition = 'center';

  elements.glassCard.style.background = glassColor;
  elements.glassCard.style.border = `${Number(state.outline).toFixed(1)}px solid ${getOutlineColor(state)}`;
  elements.glassCard.style.backdropFilter = `blur(${state.blur}px) saturate(${state.saturation}%)`;
  elements.glassCard.style.webkitBackdropFilter = `blur(${state.blur}px) saturate(${state.saturation}%)`;
}

function generateCSS() {
  const css = generateCssSnippet(state);
  elements.cssOutput.value = css;
  return css;
}

async function copyCSS() {
  const css = generateCSS();

  try {
    await navigator.clipboard.writeText(css);
  } catch {
    elements.cssOutput.focus();
    elements.cssOutput.select();
    document.execCommand('copy');
  }

  elements.copyButton.classList.add('is-success');
  elements.copyButtonLabel.textContent = 'Copiado!';
  window.setTimeout(() => {
    elements.copyButton.classList.remove('is-success');
    elements.copyButtonLabel.textContent = 'Copiar CSS';
  }, 1800);
}

function downloadCSS() {
  const css = generateCSS();
  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'glass-effect.css';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function resetState() {
  Object.assign(state, defaultState);
  updatePreview();
  generateCSS();
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
        state.colorInput = formatRgba({ red, green, blue, alpha: state.opacity }, state.opacity);
      }

      updatePreview();
      generateCSS();
    });
  });

  elements.copyButton.addEventListener('click', copyCSS);
  elements.downloadButton.addEventListener('click', downloadCSS);
  elements.resetButton.addEventListener('click', resetState);
}

const ADS_CONSENT_KEY = 'ads-consent-v1';

function getAdsConsent() {
  return window.localStorage.getItem(ADS_CONSENT_KEY);
}

function setAdsConsent(value) {
  window.localStorage.setItem(ADS_CONSENT_KEY, value);
}

function setAdShellState(loaded) {
  elements.adSlots.forEach((slot) => {
    slot.classList.toggle('is-loaded', loaded);
    slot.setAttribute('data-ad-state', loaded ? 'loaded' : 'idle');
  });
}

function runAdsForUnits(units) {
  units.forEach((unit) => {
    if (unit.dataset.adsInitialized === 'true') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      unit.dataset.adsInitialized = 'true';
    } catch (error) {
      console.error('AdSense push error:', error);
    }
  });

  setAdShellState(true);
}

function initAdsLazy() {
  const consent = getAdsConsent();
  if (consent !== 'accepted') {
    setAdShellState(false);
    return;
  }

  if (!('IntersectionObserver' in window)) {
    runAdsForUnits(elements.adUnits);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        runAdsForUnits([entry.target]);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '250px 0px' }
  );

  elements.adUnits.forEach((unit) => observer.observe(unit));
}

function bindConsentBanner() {
  const consent = getAdsConsent();

  if (consent === 'accepted' || consent === 'declined') {
    elements.consentBanner.classList.add('hidden');
    if (consent === 'accepted') {
      initAdsLazy();
    }
    return;
  }

  elements.consentBanner.classList.remove('hidden');

  elements.acceptAdsConsent.addEventListener('click', () => {
    setAdsConsent('accepted');
    elements.consentBanner.classList.add('hidden');
    initAdsLazy();
  });

  elements.declineAdsConsent.addEventListener('click', () => {
    setAdsConsent('declined');
    elements.consentBanner.classList.add('hidden');
    setAdShellState(false);
  });
}

function initApp() {
  syncInputs();
  toggleBackgroundPanels();
  updatePreview();
  generateCSS();
  bindEvents();
  bindConsentBanner();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
