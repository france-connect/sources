import { render } from '@testing-library/react';

import type { ISODate } from '@fc/common';
import { truncateMiddle } from '@fc/common';
import type { InstanceItemInterface } from '@fc/core-partners';
import { AlertComponent, LinkButton, TableComponent } from '@fc/dsfr';
import { useStylesQuery } from '@fc/styles';

import { SandboxCardComponent } from './sandbox-card.component';
import { SandboxesSectionComponent } from './sandboxes-section.component';

jest.mock('@fc/styles');
jest.mock('./sandbox-card.component', () => ({
  SandboxCardComponent: jest.fn(),
}));

const makeSandbox = (overrides: Partial<InstanceItemInterface> = {}): InstanceItemInterface => ({
  createdAt: '2024-01-15T10:00:00.000Z' as ISODate,
  creator: {
    email: 'john.doe@example.com',
    firstname: 'John',
    id: 'creator-1',
    lastname: 'Doe',
  },
  currentVersion: {
    createdAt: '2024-01-15T10:00:00.000Z' as ISODate,
    data: {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- API payload uses client_id
      client_id: 'a1b2c3d4e5f67890abcdef1234567890',
      name: 'Sandbox 1',
    },
    id: 'version-1',
    publicationStatus: 'DRAFT',
    updatedAt: '2024-01-15T10:00:00.000Z' as ISODate,
  },
  environment: 'SANDBOX',
  id: 'sandbox-1',
  updatedAt: '2024-01-15T10:00:00.000Z' as ISODate,
  ...overrides,
});

describe('SandboxesSectionComponent', () => {
  beforeEach(() => {
    jest.mocked(useStylesQuery).mockReturnValue(true);
  });

  it('should render AlertComponent when no sandboxes', () => {
    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={[]} />);

    // Then
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: 'Partners.serviceProviderPage.sandboxes.empty',
        dataTestId: 'service-provider-sandboxes-empty-alert',
        type: 'info',
      },
      undefined,
    );
  });

  it('should render link instances button on desktop when there are no sandboxes but unlinked instances exist', () => {
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);

    render(<SandboxesSectionComponent hasUnlinkedInstances sandboxes={[]} />);

    expect(LinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Partners.serviceProviderPage.sandboxes.linkInstances.button',
        dataTestId: 'service-provider-link-instances-button',
        link: 'link-instances',
      }),
      undefined,
    );
  });

  it('should render TableComponent when sandboxes exist and desktop mode', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const sandboxes: InstanceItemInterface[] = [makeSandbox()];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    expect(TableComponent).toHaveBeenCalledOnce();
    expect(TableComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'service-provider-sandboxes-table',
        multiline: true,
      }),
      undefined,
    );
  });

  it('should call truncateMiddle with sandbox client_id', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const sandboxes: InstanceItemInterface[] = [makeSandbox({ id: 'sandbox-truncate' })];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    expect(truncateMiddle).toHaveBeenCalledWith('a1b2c3d4e5f67890abcdef1234567890');
  });

  it('should display creator full name in table', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const sandboxes: InstanceItemInterface[] = [makeSandbox({ id: 'sandbox-creator' })];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    const tableSources = jest.mocked(TableComponent).mock.calls[0][0].sources;

    expect(tableSources[0]).toMatchObject({
      creator: 'John Doe',
      id: 'sandbox-creator',
    });
  });

  it('should display "-" when creator is undefined', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const sandboxes: InstanceItemInterface[] = [
      makeSandbox({ creator: undefined, id: 'sandbox-no-creator' }),
    ];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    const tableSources = jest.mocked(TableComponent).mock.calls[0][0].sources;

    expect(tableSources[0]).toMatchObject({
      creator: '-',
      id: 'sandbox-no-creator',
    });
  });

  it('should display instance name as label in table', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const sandboxes: InstanceItemInterface[] = [makeSandbox({ id: 'sandbox-name' })];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    const tableSources = jest.mocked(TableComponent).mock.calls[0][0].sources;

    expect(tableSources[0]).toMatchObject({
      id: 'sandbox-name',
      label: 'Sandbox 1',
    });
  });

  it('should render SandboxCardComponent when sandboxes exist and responsive mode', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    const sandboxes: InstanceItemInterface[] = [makeSandbox()];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    expect(SandboxCardComponent).toHaveBeenCalled();
  });

  it('should pass creator full name to SandboxCardComponent in responsive mode', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    const sandboxes: InstanceItemInterface[] = [makeSandbox({ id: 'sandbox-card-creator' })];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances={false} sandboxes={sandboxes} />);

    // Then
    expect(jest.mocked(SandboxCardComponent)).toHaveBeenCalledWith(
      expect.objectContaining({
        source: expect.objectContaining({ creator: 'John Doe' }),
      }),
      undefined,
    );
  });

  it('should render link instances button on desktop when unlinked instances exist', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    const sandboxes: InstanceItemInterface[] = [makeSandbox()];

    // When
    render(<SandboxesSectionComponent hasUnlinkedInstances sandboxes={sandboxes} />);

    // Then
    expect(LinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        children: 'Partners.serviceProviderPage.sandboxes.linkInstances.button',
        dataTestId: 'service-provider-link-instances-button',
        icon: 'links-line',
        link: 'link-instances',
      }),
      undefined,
    );
  });
});
