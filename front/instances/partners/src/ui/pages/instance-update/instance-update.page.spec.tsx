import { render } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { type AnyObjectInterface } from '@fc/common';
import { ConfigService } from '@fc/config';
import { AlertComponent, LinkComponent } from '@fc/dsfr';
import type { SchemaFieldType } from '@fc/dto2form';
import { DTO2FormComponent, removeEmptyValues, useDto2Form } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { InstanceUpdatePage } from './instance-update.page';

describe('InstanceUpdatePage', () => {
  const submitHandlerMock = jest.fn();
  const initialValuesMock = Symbol('any-initial-values-mock') as unknown as AnyObjectInterface;
  const schemaMock = Symbol('any-schema-mock') as unknown as SchemaFieldType[];

  const configExternalUrlsMock = {
    spConfigurationDocUrl: Symbol('any-spConfigurationDocUrl-mock') as unknown as string,
  };

  const configFormMock = {
    InstancesUpdate: {
      id: 'InstancesUpdate:id',
    },
  };

  const versionData = {
    name: 'any-instance-name-mock',
  };

  beforeEach(() => {
    jest.mocked(useDto2Form).mockReturnValue({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
    jest
      .mocked(ConfigService.get)
      .mockReturnValue(configFormMock)
      .mockReturnValueOnce(configFormMock)
      .mockReturnValueOnce(configExternalUrlsMock);
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners-form-updateTitle-mock')
      .mockReturnValueOnce('Partners.instance.updateIntro-mock')
      .mockReturnValueOnce('Partners.instance.noticeTitle-mock')
      .mockReturnValueOnce('Form.submit.label-mock');
    jest.mocked(useLoaderData).mockReturnValue(versionData);
  });

  it('should match the snapshot', () => {
    // When
    const { container, getByText } = render(<InstanceUpdatePage />);
    const titleElt = getByText('Partners-form-updateTitle-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledTimes(4);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.updatepage.title');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.instance.updateIntro');
    expect(t).toHaveBeenNthCalledWith(3, 'Partners.instance.noticeTitle');
    expect(t).toHaveBeenNthCalledWith(4, 'Form.submit.label');
    expect(useDto2Form).toHaveBeenCalledOnce();
    expect(useDto2Form).toHaveBeenCalledWith(configFormMock.InstancesUpdate);
    expect(DTO2FormComponent).toHaveBeenCalledOnce();
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      {
        config: {
          id: configFormMock.InstancesUpdate.id,
          title: 'any-instance-name-mock',
        },
        initialValues: initialValuesMock,
        onPostSubmit: expect.any(Function),
        onPreSubmit: removeEmptyValues,
        onSubmit: submitHandlerMock,
        schema: schemaMock,
        submitLabel: 'Form.submit.label-mock',
      },
      undefined,
    );
  });

  it('should call AlertComponent with info params', () => {
    // When
    const { container } = render(<InstanceUpdatePage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'fr-col-12 fr-col-md-8 fr-mb-4w',
        size: 'md',
        type: 'info',
      },
      undefined,
    );
  });

  it('should call LinkComponent with params', () => {
    // When
    const { container } = render(<InstanceUpdatePage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LinkComponent).toHaveBeenCalledOnce();
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        dataTestId: 'documentation-partners-link',
        external: true,
        href: configExternalUrlsMock.spConfigurationDocUrl,
        label: 'documentation partenaires',
      },
      undefined,
    );
  });

  it('should default data to empty object if no data', () => {
    // Given
    const emptyVersionData = undefined;
    jest.mocked(useLoaderData).mockReturnValueOnce(emptyVersionData);

    // When
    render(<InstanceUpdatePage />);

    // Then
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: {
          id: configFormMock.InstancesUpdate.id,
          title: undefined,
        },
      }),
      undefined,
    );
  });
});
