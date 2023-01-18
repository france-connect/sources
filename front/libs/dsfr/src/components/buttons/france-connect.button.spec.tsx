import { render } from '@testing-library/react';

import { FranceConnectButton } from './index';

describe('FranceConnectButton', () => {
  it('should match the snapshot, when showHelp is true', () => {
    // when
    const { container } = render(<FranceConnectButton showHelp />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when showHelp is false', () => {
    // when
    const { container } = render(<FranceConnectButton showHelp={false} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the defined className', () => {
    // when
    const { container } = render(<FranceConnectButton className="any-className-mock" />);

    // then
    expect(container.firstChild).toHaveClass('any-className-mock');
  });

  it('should set target and rel attributes if showIcon is true', () => {
    // when
    const { getByTitle } = render(<FranceConnectButton showHelp showIcon />);
    const element = getByTitle('Qu’est ce que FranceConnect ? - nouvelle fenêtre');

    // then
    expect(element).toHaveAttribute('target', '_blank');
    expect(element).toHaveAttribute('rel', 'noreferrer');
  });
});
