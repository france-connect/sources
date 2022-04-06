/* istanbul ignore file */

// declarative file
import { UserPreferencesConfig } from '@fc/user-preferences';

const API_BASE_URL = '/api';

export const UserPreferences: UserPreferencesConfig = {
  API_ROUTE_CSRF_TOKEN: `${API_BASE_URL}/csrf-token`,
  API_ROUTE_USER_PREFERENCES: `${API_BASE_URL}/user-preferences`,
};
