import { normalizeCityName } from './normalize-city-name.helper';

describe('normalizeCityName', () => {
  it('should uppercase the label', () => {
    // When
    const result = normalizeCityName('nancy');

    // Then
    expect(result).toBe('NANCY');
  });

  it('should remove the diacritics', () => {
    // When
    const result = normalizeCityName('Saint-Clément-de-Valorgue');

    // Then
    expect(result).toBe('SAINT CLEMENT DE VALORGUE');
  });

  it('should spell out the œ ligature', () => {
    // When
    const result = normalizeCityName('Cœuvres-et-Valsery');

    // Then
    expect(result).toBe('COEUVRES ET VALSERY');
  });

  it('should replace the hyphens by spaces', () => {
    // When
    const result = normalizeCityName('SAINT-DENIS');

    // Then
    expect(result).toBe('SAINT DENIS');
  });

  it('should replace the typographic apostrophes by spaces', () => {
    // When
    const result = normalizeCityName('Saint’Nom');

    // Then
    expect(result).toBe('SAINT NOM');
  });

  it('should drop the leading article', () => {
    // When
    const result = normalizeCityName('Le Mans');

    // Then
    expect(result).toBe('MANS');
  });

  it('should preserve articles when they are part of the INSEE name', () => {
    // When
    const result = normalizeCityName('La Passion-Clipperton', true);
    // Then
    expect(result).toBe('LA PASSION CLIPPERTON');
  });

  it('should drop the elided leading article', () => {
    // When
    const result = normalizeCityName("L'Isle-Jourdain");

    // Then
    expect(result).toBe('ISLE JOURDAIN');
  });

  it('should drop the plural leading article', () => {
    // When
    const result = normalizeCityName("Les Sables-d'Olonne");

    // Then
    expect(result).toBe('SABLES D OLONNE');
  });

  it('should keep a leading article that is the whole label', () => {
    // When
    const result = normalizeCityName('Le');

    // Then
    expect(result).toBe('LE');
  });

  it('should keep a word that only starts like an article', () => {
    // When
    const result = normalizeCityName('Lesparre-Médoc');

    // Then
    expect(result).toBe('LESPARRE MEDOC');
  });

  it('should keep the spaces apart, so that two distinct cities stay distinct', () => {
    // When
    const spaced = normalizeCityName('Mont Réal');
    const joined = normalizeCityName('Montréal');

    // Then
    expect(spaced).toBe('MONT REAL');
    expect(joined).toBe('MONTREAL');
    expect(spaced).not.toBe(joined);
  });

  it('should collapse the repeated separators', () => {
    // When
    const result = normalizeCityName('SAINT -  DENIS');

    // Then
    expect(result).toBe('SAINT DENIS');
  });

  it('should return an empty string for an empty label', () => {
    // When
    const result = normalizeCityName('');

    // Then
    expect(result).toBe('');
  });
});
