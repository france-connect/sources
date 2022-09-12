import { render } from '@testing-library/react';

import { LogoRepubliqueFrancaiseComponent } from './logo-republique-francaise.component';

describe('LogoRepubliqueFrancaiseComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LogoRepubliqueFrancaiseComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
