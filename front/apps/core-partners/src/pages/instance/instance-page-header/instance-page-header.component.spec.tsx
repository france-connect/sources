import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { LinkComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { InstancePageHeaderComponent } from './instance-page-header.component';

describe('InstancePageHeaderComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({
      spConfigurationDocUrl: 'https://example.com/docs',
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <InstancePageHeaderComponent intro="Test Intro" title="Test Title" />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call ConfigService.get with parameters', () => {
    // When
    render(<InstancePageHeaderComponent intro="Test Intro" title="Test Title" />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('ExternalUrls');
  });

  it('should call t 1 time with parameters', () => {
    // When
    render(<InstancePageHeaderComponent intro="Test Intro" title="Test Title" />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith('CorePartners.documentation.label');
  });

  it('should render LinkComponent with parameters', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-link-label-mock');

    // When
    render(<InstancePageHeaderComponent intro="Test Intro" title="Test Title" />);

    // Then
    expect(LinkComponent).toHaveBeenCalledOnce();
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        dataTestId: 'documentation-partners-link',
        external: true,
        href: 'https://example.com/docs',
        label: 'any-link-label-mock',
      },
      undefined,
    );
  });
});
