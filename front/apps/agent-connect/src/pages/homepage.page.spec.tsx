import { render } from '@testing-library/react';

import { SearchComponent, ServiceProviderNameComponent, UserHistoryComponent } from '../components';
import { HomePage } from './homepage.page';

jest.mock('../components/search/search.component');
jest.mock('../components/user-history/user-history.component');
jest.mock('../components/service-provider-name/service-provider-name.component');

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have the help button', () => {
    // when
    const { getByText } = render(<HomePage />);
    const element = getByText('J’ai besoin d’aide');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the help link', () => {
    // when
    const { getByTestId } = render(<HomePage />);
    const element = getByTestId('help-link');
    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('href', 'https://agentconnect.gouv.fr/aide');
  });

  it('should have called ServiceProviderNameComponent', () => {
    // when
    render(<HomePage />);
    // then
    expect(ServiceProviderNameComponent).toHaveBeenCalled();
  });

  it('should have called UserHistoryComponent', () => {
    // when
    render(<HomePage />);
    // then
    expect(UserHistoryComponent).toHaveBeenCalled();
  });

  it('should have called SearchComponent', () => {
    // when
    render(<HomePage />);
    // then
    expect(SearchComponent).toHaveBeenCalled();
  });
});
