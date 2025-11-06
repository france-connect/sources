import React from 'react';

export const Dto2FormServiceContext = React.createContext({
  config: {},
  getConfigEndpointsById: () => {},
  getConfigFormById: () => {},
  loadData: () => {},
});
