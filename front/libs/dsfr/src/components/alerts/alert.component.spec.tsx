import { render } from '@testing-library/react';

import { AlertTypes, Sizes } from '../../enums';
import { Alert } from './alert.component';

describe('Alert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot with size medium and type error', () => {
    // when
    const { container } = render(
      <Alert size={Sizes.MEDIUM} type={AlertTypes.ERROR}>
        Children
      </Alert>,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should have class fr-alert--sm if size is small', () => {
    // when
    const { container } = render(
      <Alert size={Sizes.SMALL} type={AlertTypes.INFO}>
        Children
      </Alert>,
    );
    const [element] = container.getElementsByClassName('fr-alert');
    expect(element).toHaveClass('fr-alert--sm');
  });

  it('should have class fr-alert--error if type is ERROR', () => {
    // when
    const { container } = render(
      <Alert size={Sizes.MEDIUM} type={AlertTypes.ERROR}>
        Children
      </Alert>,
    );
    const [element] = container.getElementsByClassName('fr-alert');
    expect(element).toHaveClass('fr-alert--error');
  });

  it('should have class fr-alert--info if type is INFO', () => {
    // when
    const { container } = render(
      <Alert size={Sizes.MEDIUM} type={AlertTypes.INFO}>
        Children
      </Alert>,
    );
    const [element] = container.getElementsByClassName('fr-alert');
    expect(element).toHaveClass('fr-alert--info');
  });

  it('should have class fr-alert--success if type is SUCCESS', () => {
    // when
    const { container } = render(
      <Alert size={Sizes.MEDIUM} type={AlertTypes.SUCCESS}>
        Children
      </Alert>,
    );
    const [element] = container.getElementsByClassName('fr-alert');
    expect(element).toHaveClass('fr-alert--success');
  });

  it('should have class fr-alert--warning if type is WARNING', () => {
    // when
    const { container } = render(
      <Alert size={Sizes.MEDIUM} type={AlertTypes.WARNING}>
        Children
      </Alert>,
    );
    const [element] = container.getElementsByClassName('fr-alert');
    expect(element).toHaveClass('fr-alert--warning');
  });
});
