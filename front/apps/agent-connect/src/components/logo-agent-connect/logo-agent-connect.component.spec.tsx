import { render } from '@testing-library/react';

import { LogoAgentConnectComponent } from './logo-agent-connect.component';

describe('LogoAgentConnectComponent', () => {
  it('should have render a component with a mocked classname property', () => {
    // when
    const { container } = render(<LogoAgentConnectComponent className="any-mock-css-class" />);
    // then
    expect(container.firstChild).toHaveClass('any-mock-css-class');
  });

  it('should have render the img child', () => {
    // when
    const { getByAltText } = render(<LogoAgentConnectComponent className="any-mock-css-class" />);
    const element = getByAltText('marianne hexagonale agentconnect');
    // then
    expect(element).toBeInTheDocument();
  });
});
