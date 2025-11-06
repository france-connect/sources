import { render } from '@testing-library/react';

import {
  InstancePageFormComponent,
  InstancePageHeaderComponent,
  InstancePageNoticeComponent,
} from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useInstanceCreate } from '../../../hooks';
import { InstanceCreatePage } from './instance-create.page';

jest.mock('../../../hooks/instance-create/instance-create.hook');

describe('InstanceCreatePage', () => {
  // Given
  const UseInstanceCreateResultMock = {
    config: expect.any(Object),
    initialValues: expect.any(Object),
    postSubmit: expect.any(Function),
    preSubmit: expect.any(Function),
    schema: expect.any(Object),
    submitHandler: expect.any(Function),
  };

  beforeEach(() => {
    // Given
    jest.mocked(useInstanceCreate).mockReturnValue(UseInstanceCreateResultMock);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<InstanceCreatePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call the useInstanceCreate hook', () => {
    // When
    render(<InstanceCreatePage />);

    // Then
    expect(useInstanceCreate).toHaveBeenCalledOnce();
    expect(useInstanceCreate).toHaveBeenCalledWith();
  });

  it('should call translations the snapshot', () => {
    // When
    render(<InstanceCreatePage />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.createpage.title');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.instance.createIntro');
  });

  it('should render InstancePageHeaderComponent with parameters', () => {
    // When
    render(<InstanceCreatePage />);

    // Then
    expect(InstancePageHeaderComponent).toHaveBeenCalledOnce();
    expect(InstancePageHeaderComponent).toHaveBeenCalledWith(
      {
        intro: 'Partners.instance.createIntro',
        title: 'Partners.createpage.title',
      },
      undefined,
    );
  });

  it('should render InstancePageNoticeComponent with parameters', () => {
    // When
    render(<InstanceCreatePage />);

    // Then
    expect(InstancePageNoticeComponent).toHaveBeenCalledOnce();
    expect(InstancePageNoticeComponent).toHaveBeenCalledWith({}, undefined);
  });

  it('should render InstancePageFormComponent with parameters', () => {
    // When
    render(<InstanceCreatePage />);

    // Then
    expect(InstancePageFormComponent).toHaveBeenCalledOnce();
    expect(InstancePageFormComponent).toHaveBeenCalledWith(
      {
        config: UseInstanceCreateResultMock.config,
        initialValues: UseInstanceCreateResultMock.initialValues,
        postSubmit: UseInstanceCreateResultMock.postSubmit,
        preSubmit: UseInstanceCreateResultMock.preSubmit,
        schema: UseInstanceCreateResultMock.schema,
        submitHandler: UseInstanceCreateResultMock.submitHandler,
      },
      undefined,
    );
  });
});
