import { render } from '@testing-library/react';

import { AlertTypes, Sizes } from '../../../enums';
import { AlertMessageComponent } from './alert-message.component';

describe('AlertMessageComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot with a small size', () => {
    // when
    const { container } = render(
      <AlertMessageComponent
        closable
        description="error description"
        size={Sizes.SMALL}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should display the title if size is small', () => {
    // when
    const result = render(
      <AlertMessageComponent
        closable={false}
        description="error description"
        size={Sizes.SMALL}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    const title = result.getByTestId('AlertMessageComponent-title-label');
    const description = result.queryByTestId('AlertMessageComponent-description-label');
    // then
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('error title');
    expect(title).not.toHaveAttribute('class', 'fr-alert__title');
    expect(description).not.toBeInTheDocument();
  });

  it('should display the title with its dsfr class if size is medium', () => {
    // when
    const result = render(
      <AlertMessageComponent
        closable={false}
        description="error description"
        size={Sizes.MEDIUM}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    const title = result.getByTestId('AlertMessageComponent-title-label');
    // then
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('class', 'fr-alert__title');
    expect(title).toHaveTextContent('error title');
  });

  it('should display the description if size is medium and the description props exist', () => {
    // when
    const result = render(
      <AlertMessageComponent
        closable={false}
        description="error description"
        size={Sizes.MEDIUM}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    const description = result.getByTestId('AlertMessageComponent-description-label');
    // then
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('error description');
  });

  it('should not display the description if size is medium but the description props does not exist', () => {
    // when
    const result = render(
      <AlertMessageComponent
        closable={false}
        size={Sizes.MEDIUM}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    const description = result.queryByTestId('AlertMessageComponent-description-label');
    // then
    expect(description).not.toBeInTheDocument();
  });

  it('should display a closing button if the alert is closable', () => {
    // when
    const result = render(
      <AlertMessageComponent
        closable
        description="error description"
        size={Sizes.MEDIUM}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    const closeButton = result.getByTestId('AlertMessageComponent-close-button');
    // then
    expect(closeButton).toBeInTheDocument();
  });

  it('should not display the closing button if the alert is not closable', () => {
    // when
    const result = render(
      <AlertMessageComponent
        closable={false}
        description="error description"
        size={Sizes.MEDIUM}
        title="error title"
        type={AlertTypes.ERROR}
      />,
    );
    const closeButton = result.queryByTestId('AlertMessageComponent-close-button');
    // then
    expect(closeButton).not.toBeInTheDocument();
  });
});
