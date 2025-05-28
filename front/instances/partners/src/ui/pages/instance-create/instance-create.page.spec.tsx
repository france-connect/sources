import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { AlertComponent, LinkComponent } from '@fc/dsfr';
import type { SchemaFieldType } from '@fc/dto2form';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { useInstanceCreate } from '../../../hooks';
import { InstanceCreatePage } from './instance-create.page';

jest.mock('../../../hooks/instance-create/instance-create.hook');

describe('InstanceCreatePage', () => {
  const submitHandlerMock = jest.fn();
  const schemaMock = Symbol('any-schema-mock') as unknown as SchemaFieldType[];
  const initialValuesMock = Symbol('any-initial-values-mock') as unknown as Record<
    string,
    string | string[]
  >;
  const configMock = {
    spConfigurationDocUrl: Symbol('any-spConfigurationDocUrl-mock') as unknown as string,
  };

  beforeEach(() => {
    jest.mocked(useInstanceCreate).mockReturnValueOnce({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
    jest.mocked(ConfigService.get).mockReturnValueOnce(configMock);
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners-form-createTitle-mock')
      .mockReturnValueOnce('Partners.instance.noticeTitle-mock')
      .mockReturnValueOnce('Form.submit.label-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container, getByText } = render(<InstanceCreatePage />);
    const titleElt = getByText('Partners-form-createTitle-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.createpage.title');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.instance.noticeTitle');
    expect(t).toHaveBeenNthCalledWith(3, 'Form.submit.label');
    expect(useInstanceCreate).toHaveBeenCalledOnce();
    expect(useInstanceCreate).toHaveBeenCalledWith();
    expect(DTO2FormComponent).toHaveBeenCalledOnce();
    expect(DTO2FormComponent).toHaveBeenCalledWith(
      {
        config: { id: 'DTO2Form-instance-create' },
        initialValues: initialValuesMock,
        onSubmit: submitHandlerMock,
        schema: schemaMock,
        submitLabel: 'Form.submit.label-mock',
      },
      undefined,
    );
  });

  it('should call AlertComponent with info params', () => {
    // When
    const { container } = render(<InstanceCreatePage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'fr-col-12 fr-col-md-8 fr-mb-4w',
        size: 'md',
        title: 'Partners.instance.noticeTitle-mock',
        type: 'info',
      },
      undefined,
    );
  });

  it('should call LinkComponent with params', () => {
    // When
    const { container } = render(<InstanceCreatePage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LinkComponent).toHaveBeenCalledOnce();
    expect(LinkComponent).toHaveBeenCalledWith(
      {
        dataTestId: 'documentation-partners-link',
        href: configMock.spConfigurationDocUrl,
        label: 'documentation partenaires',
        rel: 'noopener noreferrer external',
        target: '_blank',
      },
      undefined,
    );
  });
});
