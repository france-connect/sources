import { render } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import type { TrackInterface } from '@fc/core-user-dashboard';
import {
  IdentityTheftReportConnectionListActionsComponent,
  IdentityTheftReportHelpEventIdAccordionComponent,
  IdentityTheftReportTracksComponent,
} from '@fc/core-user-dashboard';

import type { FraudTracksLoaderResponseInterface } from '../../../../interfaces';
import { IdentityTheftReportConnectionListPage } from './identity-theft-report-connection-list.page';

describe('IdentityTheftReportConnectionListPage', () => {
  // Given
  const loadDataEmptyTracksMock = {
    meta: { code: 'any-connection-code-mock' },
    payload: [] as unknown as FraudTracksLoaderResponseInterface,
  };
  const loadDataNotEmptyTracksMock = {
    meta: { code: 'any-connection-code-mock' },
    payload: [
      Symbol('any-track-mock-1') as unknown as TrackInterface,
    ] as unknown as FraudTracksLoaderResponseInterface,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({ data: loadDataEmptyTracksMock });
  });

  it('should match the snapshot when tracks is not empty', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({ data: loadDataNotEmptyTracksMock });

    // When
    const { container, getByTestId } = render(<IdentityTheftReportConnectionListPage />);
    const containerElt = getByTestId('IdentityTheftReportConnectionListPage-container');

    // Then
    expect(container).toMatchSnapshot();
    expect(containerElt).toHaveClass('fr-border-default--grey');
  });

  it('should call loaderData', () => {
    // When
    render(<IdentityTheftReportConnectionListPage />);

    // Then
    expect(useLoaderData).toHaveBeenCalledOnce();
  });

  it('should render the list', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({ data: loadDataNotEmptyTracksMock });

    // When
    render(<IdentityTheftReportConnectionListPage />);

    // Then
    expect(IdentityTheftReportTracksComponent).toHaveBeenCalledExactlyOnceWith({
      code: loadDataEmptyTracksMock.meta.code,
      tracks: loadDataNotEmptyTracksMock.payload,
    });
  });

  it('should render actions', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({ data: loadDataNotEmptyTracksMock });

    // When
    render(<IdentityTheftReportConnectionListPage />);

    // Then
    expect(IdentityTheftReportConnectionListActionsComponent).toHaveBeenCalledExactlyOnceWith({});
  });

  it('should render AccordionComponent', () => {
    // When
    render(<IdentityTheftReportConnectionListPage />);

    // Then
    expect(IdentityTheftReportHelpEventIdAccordionComponent).toHaveBeenCalledExactlyOnceWith({});
  });
});
