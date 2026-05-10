import { describe, it, expect } from 'vitest';
import {
  defaultState,
  clamp,
  componentToHex,
  rgbToHex,
  isHexColor,
  parseRgbString,
  hexToRgb,
  formatRgba,
  normalizeGlassColor,
  getOutlineColor,
  getPreviewBackground,
  generateCssSnippet,
} from '../../src/lib/glass.js';

describe('glass helpers', () => {
  it('clamp limita valores', () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(7, 0, 10)).toBe(7);
  });

  it('componentToHex e rgbToHex convertem corretamente', () => {
    expect(componentToHex(10)).toBe('0a');
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
  });

  it('isHexColor valida #rgb e #rrggbb', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#a1b2c3')).toBe(true);
    expect(isHexColor('abc')).toBe(false);
  });

  it('parseRgbString interpreta rgb/rgba e aplica clamp', () => {
    expect(parseRgbString('rgb(10, 20, 30)')).toEqual({ red: 10, green: 20, blue: 30, alpha: null });
    expect(parseRgbString('rgba(300, -1, 10, 2)')).toBeNull();
    expect(parseRgbString('rgba(255, 0, 10, 0.5)')).toEqual({ red: 255, green: 0, blue: 10, alpha: 0.5 });
  });

  it('hexToRgb converte 3 e 6 dígitos', () => {
    expect(hexToRgb('#fff')).toEqual({ red: 255, green: 255, blue: 255 });
    expect(hexToRgb('#123456')).toEqual({ red: 18, green: 52, blue: 86 });
  });

  it('formatRgba resolve alpha com fallback', () => {
    expect(formatRgba({ red: 1, green: 2, blue: 3, alpha: null }, 0.3)).toBe('rgba(1, 2, 3, 0.30)');
    expect(formatRgba({ red: 1, green: 2, blue: 3, alpha: 0.5 }, 0.3)).toBe('rgba(1, 2, 3, 0.50)');
  });

  it('normalizeGlassColor funciona com HEX curto, HEX completo, RGBA e fallback', () => {
    const shortHex = { ...defaultState, colorInput: '#fff' };
    expect(normalizeGlassColor(shortHex)).toBe('rgba(255, 255, 255, 0.28)');

    const fullHex = { ...defaultState, colorInput: '#123456' };
    expect(normalizeGlassColor(fullHex)).toBe('rgba(18, 52, 86, 0.28)');

    const rgbaState = { ...defaultState, colorInput: 'rgba(10, 20, 30, 0.6)' };
    expect(normalizeGlassColor(rgbaState)).toBe('rgba(10, 20, 30, 0.60)');

    const invalidState = { ...defaultState, colorInput: 'invalid' };
    expect(normalizeGlassColor(invalidState)).toBe('rgba(255, 255, 255, 0.28)');
  });

  it('getOutlineColor usa cor normalizada e fallback defensivo', () => {
    const s = { ...defaultState, colorInput: 'rgba(100, 120, 140, 0.3)' };
    expect(getOutlineColor(s)).toBe('rgba(100, 120, 140, 0.32)');

    const fallback = { ...defaultState, colorInput: 'invalid', colorPicker: '#zzzzzz' };
    expect(getOutlineColor(fallback)).toBe('rgba(255, 255, 255, 0.35)');
  });

  it('getPreviewBackground retorna conforme modo', () => {
    const gradient = { ...defaultState, backgroundType: 'gradient' };
    expect(getPreviewBackground(gradient)).toContain('linear-gradient');

    const solid = { ...defaultState, backgroundType: 'solid', solidColor: '#111111' };
    expect(getPreviewBackground(solid)).toBe('#111111');

    const image = { ...defaultState, backgroundType: 'image', imageTheme: 'workspace' };
    expect(getPreviewBackground(image)).toContain('url(');

    const imageFallback = { ...defaultState, backgroundType: 'image', imageTheme: 'unknown' };
    expect(getPreviewBackground(imageFallback)).toContain('photo-1518770660439-4636190af475');
  });

  it('generateCssSnippet cria css final', () => {
    const css = generateCssSnippet({ ...defaultState });
    expect(css).toContain('.glass-effect');
    expect(css).toContain('backdrop-filter: blur(18px) saturate(140%)');
    expect(css).toContain('border-radius: 32px');
  });
});
