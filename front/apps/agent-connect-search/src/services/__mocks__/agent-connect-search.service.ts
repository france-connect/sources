import { searchResults } from '../../__fixtures__';

export const AgentConnectSearchService = {
  initialize: jest.fn(() => false),
  search: jest.fn(() => searchResults),
  showAllResults: jest.fn(() => searchResults),
};
