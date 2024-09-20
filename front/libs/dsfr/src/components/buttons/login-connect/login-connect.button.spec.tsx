import { fireEvent, render } from '@testing-library/react';

import { ButtonTypes, ConnectTypes } from '../../../enums';
import { LoginConnectButton } from './login-connect.button';

describe('LoginConnectButton', () => {
  it('should match the snapshot, when default values', () => {
    // when
    const { container } = render(<LoginConnectButton connectType={ConnectTypes.FRANCE_CONNECT} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when connect type is FranceConnect', () => {
    // when
    const { container } = render(<LoginConnectButton connectType={ConnectTypes.FRANCE_CONNECT} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when connect type is AgentConnect', () => {
    // when
    const { container } = render(<LoginConnectButton connectType={ConnectTypes.AGENT_CONNECT} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when showHelp is true', () => {
    // when
    const { container } = render(
      <LoginConnectButton showHelp connectType={ConnectTypes.FRANCE_CONNECT} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when type is submit', () => {
    // when
    const { container } = render(
      <LoginConnectButton
        connectType={ConnectTypes.FRANCE_CONNECT}
        showHelp={false}
        type={ButtonTypes.SUBMIT}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when showHelp is false', () => {
    // when
    const { container } = render(
      <LoginConnectButton connectType={ConnectTypes.FRANCE_CONNECT} showHelp={false} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the defined className', () => {
    // when
    const { container } = render(
      <LoginConnectButton
        className="any-className-mock"
        connectType={ConnectTypes.FRANCE_CONNECT}
      />,
    );

    // then
    expect(container.firstChild).toHaveClass('any-className-mock');
  });

  it('should set target and rel attributes if showIcon is true', () => {
    // when
    const { getByTitle } = render(
      <LoginConnectButton showHelp showIcon connectType={ConnectTypes.FRANCE_CONNECT} />,
    );
    const element = getByTitle('Qu’est ce que FranceConnect ? - nouvelle fenêtre');

    // then
    expect(element).toHaveAttribute('target', '_blank');
    expect(element).toHaveAttribute('rel', 'noreferrer');
  });

  it('should trigger clickHandler on button click', () => {
    // given
    const clickHandlerMock = jest.fn();

    // when
    const { getByRole } = render(
      <LoginConnectButton connectType={ConnectTypes.FRANCE_CONNECT} onClick={clickHandlerMock} />,
    );
    const element = getByRole('button');
    fireEvent.click(element);

    // then
    expect(clickHandlerMock).toHaveBeenCalled();
  });
});
