import { describe, it, expect } from 'vitest';
import { getCategoryColor } from './formatters';

describe('getCategoryColor', () => {
  it('should return red colors for entertainment category', () => {
    const colors = getCategoryColor('entertainment');
    expect(colors.bg).toBe('#fee2e2');
    expect(colors.text).toBe('#991b1b');
    expect(colors.border).toBe('#fca5a5');
  });

  it('should return green colors for education category', () => {
    const colors = getCategoryColor('education');
    expect(colors.bg).toBe('#d1fae5');
    expect(colors.text).toBe('#065f46');
    expect(colors.border).toBe('#6ee7b7');
  });

  it('should return purple colors for health-fitness category', () => {
    const colors = getCategoryColor('health-fitness');
    expect(colors.bg).toBe('#e9d5ff');
    expect(colors.text).toBe('#6b21a8');
    expect(colors.border).toBe('#c084fc');
  });

  it('should return blue colors for productivity category', () => {
    const colors = getCategoryColor('productivity');
    expect(colors.bg).toBe('#dbeafe');
    expect(colors.text).toBe('#1e40af');
    expect(colors.border).toBe('#93c5fd');
  });

  it('should return orange colors for utilities category', () => {
    const colors = getCategoryColor('utilities');
    expect(colors.bg).toBe('#ffedd5');
    expect(colors.text).toBe('#9a3412');
    expect(colors.border).toBe('#fdba74');
  });

  it('should return yellow colors for shopping category', () => {
    const colors = getCategoryColor('shopping');
    expect(colors.bg).toBe('#fef3c7');
    expect(colors.text).toBe('#92400e');
    expect(colors.border).toBe('#fcd34d');
  });

  it('should return cyan colors for finance category', () => {
    const colors = getCategoryColor('finance');
    expect(colors.bg).toBe('#cffafe');
    expect(colors.text).toBe('#155e75');
    expect(colors.border).toBe('#67e8f9');
  });

  it('should return gray colors for other category', () => {
    const colors = getCategoryColor('other');
    expect(colors.bg).toBe('#f3f4f6');
    expect(colors.text).toBe('#374151');
    expect(colors.border).toBe('#d1d5db');
  });

  it('should default to gray colors for unknown category', () => {
    const colors = getCategoryColor('unknown-category');
    expect(colors.bg).toBe('#f3f4f6');
    expect(colors.text).toBe('#374151');
    expect(colors.border).toBe('#d1d5db');
  });

  it('should return an object with bg, text, and border properties', () => {
    const colors = getCategoryColor('entertainment');
    expect(colors).toHaveProperty('bg');
    expect(colors).toHaveProperty('text');
    expect(colors).toHaveProperty('border');
  });
});
