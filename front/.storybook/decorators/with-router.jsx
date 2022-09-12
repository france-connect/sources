import { makeDecorator } from '@storybook/addons';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

export const withRouter = makeDecorator({
  name: 'withRouter',
  parameterName: 'router',
  wrapper: (storyFn, context) => (
    <MemoryRouter initialEntries={['/']}>{storyFn(context)}</MemoryRouter>
  ),
});
