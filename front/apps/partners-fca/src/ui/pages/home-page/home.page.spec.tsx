import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { useApiGet } from '@fc/common';

import { HomePage } from './home.page';

describe('HomePage', () => {
  const useApiGetMock = mocked(useApiGet);

  beforeEach(() => {
    useApiGetMock.mockReturnValue('Hello Partenaires Agent Connect');
  });

  it('should have called useApiGet hook', () => {
    // given
    render(<HomePage />);
    // then
    expect(useApiGetMock).toHaveBeenCalled();
  });

  it('should match the snapshot', () => {
    const { container } = render(<HomePage />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
