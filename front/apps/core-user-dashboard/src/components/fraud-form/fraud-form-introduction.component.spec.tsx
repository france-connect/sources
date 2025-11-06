import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { FraudFormIntroductionComponent } from './fraud-form-introduction.component';

describe('FraudFormIntroductionComponent', () => {
  beforeEach(() => {
    jest
      .mocked(t)
      .mockReturnValueOnce('any-introduction-title-mock')
      .mockReturnValueOnce('any-description-title-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<FraudFormIntroductionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call t 2 time with correct params', () => {
    // When
    render(<FraudFormIntroductionComponent />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'FraudForm.introduction.title');
    expect(t).toHaveBeenNthCalledWith(2, 'FraudForm.introduction.description');
  });
});
