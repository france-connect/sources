import * as colors from '../constants';
import { ILoggerColorParams } from '../interfaces';
import * as utils from './logger-colors.utils';

describe('stringToColor()', () => {
  it('should generate a color from a string', () => {
    // Given
    const strMock = 'test string value';
    const colorMock = '#70fdd4';
    // When
    const result = utils.stringToColor(strMock);
    // Then
    expect(result).toStrictEqual(colorMock);
  });
});

describe('getInvertColor()', () => {
  it('should return white `#FFFFFF` from an dark hexa color (6 hexa digits)', () => {
    // Given
    const colorMock = '#0F0F0F';
    // When
    const result = utils.getInvertColor(colorMock);
    // Then
    expect(result).toStrictEqual(colors.loggerLuminosityColorsConstant.WHITE);
  });

  it('should return black `#000000` from an light hexa color (6 hexa digits)', () => {
    // Given
    const colorMock = '#F0F0F0';
    // When
    const result = utils.getInvertColor(colorMock);
    // Then
    expect(result).toStrictEqual(colors.loggerLuminosityColorsConstant.BLACK);
  });

  it('should return white `#FFFFFF` from an dark hexa color (3 hexa digits)', () => {
    // Given
    const colorMock = '#004';
    // When
    const result = utils.getInvertColor(colorMock);
    // Then
    expect(result).toStrictEqual(colors.loggerLuminosityColorsConstant.WHITE);
  });

  it('should return black `#000000` from an dark hexa color (3 hexa digits)', () => {
    // Given
    const colorMock = '#FFE';
    // When
    const result = utils.getInvertColor(colorMock);
    // Then
    expect(result).toStrictEqual(colors.loggerLuminosityColorsConstant.BLACK);
  });

  it('should throw an Error if the color argument is not an hexadecimal value', () => {
    // Given
    const colorMock = 'NOT-HEXADECIMAL-COLOR';
    // When / Then
    expect(() => utils.getInvertColor(colorMock)).toThrow(
      Error('Invalid HEX color.'),
    );
  });
});

describe('getColorsFromText()', () => {
  it('should return a dark background AND white text object of `ILoggerColorParams` type.', () => {
    // Given
    const contextMock = 'I am a dark background';
    const colorLightMock: ILoggerColorParams = {
      BACKGROUND_COLOR: '#dc767a',
      TEXT_COLOR: '#FFFFFF',
    };
    // When
    const result = utils.getColorsFromText(contextMock);
    // Then
    expect(result).toStrictEqual(colorLightMock);
  });
});

describe('getStyle()', () => {
  it('should return CSS string from an `ILoggerColorParams` color object.', () => {
    // Given
    const colorMock: ILoggerColorParams = {
      TEXT_COLOR: '#EE33FF',
      BACKGROUND_COLOR: '#EEFF55',
    };
    const styleMock = `font-size: 11px;
font-weight: 400;
margin: 1px;
padding: 2px;
border-radius: 3px;
color: ${colorMock.TEXT_COLOR};
background-color: ${colorMock.BACKGROUND_COLOR};`;
    // When
    const result = utils.getStyle(colorMock);
    // Then
    expect(typeof result).toBe('string');
    expect(result).toStrictEqual(styleMock);
  });

  it('should return CSS string in black/white without color object.', () => {
    // Given
    const BLACK = '#000000';
    const WHITE = '#FFFFFF';
    const styleMock = `font-size: 11px;
font-weight: 400;
margin: 1px;
padding: 2px;
border-radius: 3px;
color: ${WHITE};
background-color: ${BLACK};`;
    // When
    const result = utils.getStyle();
    // Then
    expect(result).toStrictEqual(styleMock);
  });
});
