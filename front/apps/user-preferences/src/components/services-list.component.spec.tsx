import { render } from '@testing-library/react';

import { ServiceComponent } from './service.component';
import { ServicesListComponent } from './services-list.component';

jest.mock('./service.component');

describe('ServicesListComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<ServicesListComponent identityProviders={[]} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call ServiceComponent with a service', () => {
    // given
    const identityProviders = [
      {
        active: false,
        image: 'any-image',
        isChecked: false,
        name: 'any-name-1',
        title: 'any-title',
        uid: 'any-uid-1',
      },
      {
        active: false,
        image: 'any-image',
        isChecked: false,
        name: 'any-name-2',
        title: 'any-title',
        uid: 'any-uid-2',
      },
    ];

    // when
    render(<ServicesListComponent identityProviders={identityProviders} />);

    // then
    expect(ServiceComponent).toHaveBeenCalledTimes(2);
    expect(ServiceComponent).toHaveBeenNthCalledWith(1, { service: identityProviders[0] }, {});
    expect(ServiceComponent).toHaveBeenNthCalledWith(2, { service: identityProviders[1] }, {});
  });
});
