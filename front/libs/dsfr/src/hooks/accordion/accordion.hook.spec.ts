import { useContentHeight } from '@fc/common';

import { useAccordion } from './accordion.hook';

describe('useAccordion', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useContentHeight).mockReturnValue({
      contentHeight: 100,
      contentRef: { current: expect.any(Object) },
    });
  });

  it('should return default styles when contentRef is not set', () => {
    // Given
    jest.mocked(useContentHeight).mockReturnValueOnce({
      contentHeight: 100,
      contentRef: { current: null },
    });

    // When
    const { contentStyle } = useAccordion(expect.any(Boolean));

    // Then
    expect(contentStyle).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse': '-99999px',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse-max-height': '0',
    });
  });

  it('should return styles with collapse and collapse-max-height when is opened', () => {
    // When
    const { contentStyle } = useAccordion(true);

    // Then
    expect(contentStyle).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse': '-100px',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse-max-height': 'none',
    });
  });

  it('should return styles with collapse and collapse-max-height when is not pened', () => {
    // When
    const { contentStyle } = useAccordion(false);

    // Then
    expect(contentStyle).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse': '-100px',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse-max-height': '0',
    });
  });

  it('should return contentRef', () => {
    // When
    const { contentRef } = useAccordion(false);

    // Then
    expect(contentRef).toBeDefined();
  });
});
