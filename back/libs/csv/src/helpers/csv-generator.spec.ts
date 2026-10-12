import { generateCSVContent } from './csv-generator';

describe('generateCSVContent', () => {
  it('should return an empty string when data is empty', () => {
    // When / Then
    expect(generateCSVContent([])).toBe('');
  });

  it('should generate CSV with correct headers and data rows', () => {
    // Given
    const data = [{ col1: 'value1', col2: 'value2' }];
    const expected = 'col1,col2\nvalue1,value2';

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should handle null values by converting them to empty strings', () => {
    // Given
    const data = [{ col1: 'value1', col2: null }];
    const expected = `col1,col2\nvalue1,`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should handle undefined values by converting them to empty strings', () => {
    // Given
    const data = [{ col1: 'value1', col2: undefined }];
    const expected = `col1,col2\nvalue1,`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should keep columns present on later rows when the first row omits them', () => {
    // Given
    const data = [
      { date: '01/01/2026', ipAddress: '1.1.1.1' },
      {
        date: '02/01/2026',
        ipAddress: '2.2.2.2',
        port: '45826',
        region: 'Île-de-France',
        organization: 'OVH SAS',
      },
    ];
    const expected = [
      'date,ipAddress,port,region,organization',
      '01/01/2026,1.1.1.1,,,',
      '02/01/2026,2.2.2.2,45826,Île-de-France,OVH SAS',
    ].join('\n');

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should handle array values by joining them with semicolons', () => {
    // Given
    const data = [{ col1: ['a', 'b', 'c'] }];
    const expected = `col1\na;b;c`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should handle boolean values by converting them to strings', () => {
    // Given
    const data = [{ col1: true }];
    const expected = `col1\ntrue`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should handle numeric values by converting them to strings', () => {
    // Given
    const data = [{ col1: 123 }];
    const expected = `col1\n123`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should properly escape strings containing double quotes', () => {
    // Given
    const data = [{ col1: 'Hello "world"' }];
    const expected = `col1\n"Hello ""world"""`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should properly escape strings containing commas', () => {
    // Given
    const data = [{ col1: 'value1,value2' }];
    const expected = `col1\n"value1,value2"`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });

  it('should properly escape strings containing newlines', () => {
    // Given
    const data = [{ col1: 'Line1\nLine2' }];
    const expected = `col1\n"Line1\nLine2"`;

    // When / Then
    expect(generateCSVContent(data)).toBe(expected);
  });
});
