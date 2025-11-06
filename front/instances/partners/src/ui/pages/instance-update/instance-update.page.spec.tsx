import { render } from '@testing-library/react';

import {
  InstancePageFormComponent,
  InstancePageHeaderComponent,
  InstancePageNoticeComponent,
} from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useInstanceUpdate } from '../../../hooks';
import { InstanceUpdatePage } from './instance-update.page';

jest.mock('../../../hooks/instance-update/instance-update.hook');

describe('InstanceUpdatePage', () => {
  // Given
  const UseInstanceUpdateResultMock = {
    config: expect.any(Object),
    initialValues: expect.any(Object),
    postSubmit: expect.any(Function),
    preSubmit: expect.any(Function),
    schema: expect.any(Object),
    submitHandler: expect.any(Function),
  };

  beforeEach(() => {
    // Given
    jest.mocked(useInstanceUpdate).mockReturnValue(UseInstanceUpdateResultMock);
    jest
      .mocked(t)
      .mockReturnValueOnce('partners-updatepage-title-mock')
      .mockReturnValueOnce('partners-updatepage-intro-mock')
      .mockReturnValueOnce('partners-updatepage-notice-title-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<InstanceUpdatePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call the useInstanceUpdate hook', () => {
    // When
    render(<InstanceUpdatePage />);

    // Then
    expect(useInstanceUpdate).toHaveBeenCalledOnce();
    expect(useInstanceUpdate).toHaveBeenCalledWith();
  });

  it('should call translations the snapshot', () => {
    // When
    render(<InstanceUpdatePage />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.updatepage.title');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.instance.updateIntro');
  });

  it('should render InstancePageHeaderComponent with parameters', () => {
    // When
    render(<InstanceUpdatePage />);

    // Then
    expect(InstancePageHeaderComponent).toHaveBeenCalledOnce();
    expect(InstancePageHeaderComponent).toHaveBeenCalledWith(
      {
        intro: 'partners-updatepage-intro-mock',
        title: 'partners-updatepage-title-mock',
      },
      undefined,
    );
  });

  it('should render InstancePageNoticeComponent with parameters', () => {
    // When
    render(<InstanceUpdatePage />);

    // Then
    expect(InstancePageNoticeComponent).toHaveBeenCalledOnce();
    expect(InstancePageNoticeComponent).toHaveBeenCalledWith({}, undefined);
  });

  it('should render InstancePageFormComponent with parameters', () => {
    // When
    render(<InstanceUpdatePage />);

    // Then
    expect(InstancePageFormComponent).toHaveBeenCalledOnce();
    expect(InstancePageFormComponent).toHaveBeenCalledWith(
      {
        config: UseInstanceUpdateResultMock.config,
        initialValues: UseInstanceUpdateResultMock.initialValues,
        postSubmit: UseInstanceUpdateResultMock.postSubmit,
        preSubmit: UseInstanceUpdateResultMock.preSubmit,
        schema: UseInstanceUpdateResultMock.schema,
        submitHandler: UseInstanceUpdateResultMock.submitHandler,
      },
      undefined,
    );
  });
});
