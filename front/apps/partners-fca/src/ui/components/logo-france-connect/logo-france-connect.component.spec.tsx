import { render } from '@testing-library/react';

import { LogoFranceConnectComponent } from './logo-france-connect.component';

describe('LogoFranceConnectComponent', () => {
  it('should match the snapshot', () => {
    const { container } = render(<LogoFranceConnectComponent />);

    expect(container).toMatchSnapshot();
  });

  it('should render an element with a given classname', () => {
    // when
    const { container } = render(<LogoFranceConnectComponent className="mock-classname" />);
    // then
    const elements = container.getElementsByClassName('mock-classname');
    expect(elements).toHaveLength(1);
  });
});
