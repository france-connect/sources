import { render } from '@testing-library/react';

import { LogoRepubliqueFrancaiseComponent } from './logo-republique-francaise.component';

describe('LogoRepubliqueFrancaiseComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<LogoRepubliqueFrancaiseComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
