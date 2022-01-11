import { render } from '@testing-library/react';

import { LogoMarianneComponent } from './index';

describe('LogoMarianneComponent', () => {
  it('should add a classname string to component', () => {
    // given
    const { getByTestId } = render(<LogoMarianneComponent className="mock-any-classname" />);
    // when
    const element = getByTestId('logo-marianne-wrapper');
    // then
    expect(element).toBeInTheDocument();
    expect(element.className).toContain('mock-any-classname');
  });
});
