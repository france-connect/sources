import { render } from '@testing-library/react';
import { Outlet } from 'react-router';

import { MessageTypes } from '@fc/common';
import { ConfigService } from '@fc/config';
import { NoticeComponent } from '@fc/dsfr';

import type { NoticeConfigInterface } from '../../../interfaces';
import { NoticeLayout } from './notice.layout';

describe('NoticeLayout', () => {
  const configMock: NoticeConfigInterface = {
    description: 'notice description',
    enabled: true,
    link: {
      href: 'https://example.test/notice',
      label: 'notice link label',
    },
    title: 'notice title',
    type: MessageTypes.INFO,
  };

  beforeEach(() => {
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<NoticeLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should read the Notice config', () => {
    // When
    render(<NoticeLayout />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Notice');
  });

  it('should call Outlet component', () => {
    // When
    render(<NoticeLayout />);

    // Then
    expect(Outlet).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it('should call NoticeComponent with the configured notice props and a link', () => {
    // When
    render(<NoticeLayout />);

    // Then
    expect(NoticeComponent).toHaveBeenCalledExactlyOnceWith(
      {
        description: 'notice description',
        link: {
          href: 'https://example.test/notice',
          label: 'notice link label',
          title: 'notice link label',
        },
        title: 'notice title',
        type: MessageTypes.INFO,
      },
      undefined,
    );
  });

  it('should call NoticeComponent without a link when none is configured', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({ ...configMock, link: undefined });

    // When
    render(<NoticeLayout />);

    // Then
    expect(NoticeComponent).toHaveBeenCalledExactlyOnceWith(
      {
        description: 'notice description',
        link: undefined,
        title: 'notice title',
        type: MessageTypes.INFO,
      },
      undefined,
    );
  });

  it('should not render NoticeComponent when the notice is disabled', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({ ...configMock, enabled: false });

    // When
    render(<NoticeLayout />);

    // Then
    expect(NoticeComponent).not.toHaveBeenCalled();
    expect(Outlet).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });
});
