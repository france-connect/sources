import { fireEvent, render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { NoticeComponent } from './notice.component';

describe('NoticeComponent', () => {
  it('should match snapshot', () => {
    // When
    const { container, getByText } = render(<NoticeComponent title="any-title-mock" />);
    const titleElt = getByText('any-title-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
  });

  it('should match snapshot with optionnals props', () => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('DSFR.notice.close-mock')
      .mockReturnValueOnce('FC.Common.newWindow-mock');

    // When
    const { container, getByText, getByTitle } = render(
      <NoticeComponent
        description="any-description-mock"
        link={{
          href: 'any-href-mock',
          label: 'any-link-label-mock',
          title: 'any-link-title-mock',
        }}
        title="any-title-mock"
        onClose={jest.fn()}
      />,
    );
    const titleElt = getByText('any-title-mock');
    const linkElt = getByText('any-link-label-mock');
    const descriptionElt = getByText('any-description-mock');
    const buttonElt = getByTitle('DSFR.notice.close-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'DSFR.notice.close');
    expect(t).toHaveBeenNthCalledWith(2, 'FC.Common.newWindow');
    expect(titleElt).toBeInTheDocument();
    expect(descriptionElt).toBeInTheDocument();
    expect(linkElt).toBeInTheDocument();
    expect(linkElt).toHaveAttribute('href', 'any-href-mock');
    expect(linkElt).toHaveAttribute('title', 'any-link-title-mock - FC.Common.newWindow-mock');
    expect(buttonElt).toBeInTheDocument();
  });

  it('should call onClose with user click the button', () => {
    // Given
    const onCloseMock = jest.fn();
    jest.mocked(t).mockReturnValueOnce('DSFR.notice.close-mock');

    // When
    const { getByTitle } = render(<NoticeComponent title="any-title-mock" onClose={onCloseMock} />);
    const buttonElt = getByTitle('DSFR.notice.close-mock');
    fireEvent.click(buttonElt);

    // Then
    expect(onCloseMock).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.notice.close');
  });
});
