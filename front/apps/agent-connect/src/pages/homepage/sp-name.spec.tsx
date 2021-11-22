import { renderWithRedux } from '../../testUtils';
import ServiceProviderName from './sp-name';

describe('ServiceProviderName', () => {
  it('should renderWithRedux the title from redux store', () => {
    const mockTitle = 'mock-title';
    const { getByText } = renderWithRedux(<ServiceProviderName />, {
      initialState: {
        serviceProviderName: mockTitle,
      },
    });
    const titleElement = getByText(mockTitle);
    expect(titleElement).toBeInTheDocument();
  });
});
