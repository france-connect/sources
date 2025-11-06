import { render } from '@testing-library/react';

import { HeadingTag } from '@fc/common';

import type { FormActionsInterface } from '../../../interfaces';
import { FormActionsComponent } from '../form-actions';
import { FormErrorComponent } from '../form-error';
import { FormErrorScrollComponent } from '../form-error-scroll';
import { FormHeaderComponent } from '../form-header';
import { FormMentionsComponent } from '../form-mentions';
import { FormRequiredMessageComponent } from '../form-required';
import { FormWrapperComponent } from './form-wrapper.component';

jest.mock('./../form-actions/form-actions.component');
jest.mock('./../form-error/form-error.component');
jest.mock('./../form-error-scroll/form-error-scroll.component');
jest.mock('./../form-header/form-header.component');
jest.mock('./../form-mentions/form-mentions.component');
jest.mock('./../form-required/form-required.component');

describe('FormWrapperComponent', () => {
  it('should match snapshot', () => {
    // Given
    const handleSubmitMock = jest.fn();
    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container, getByTestId, getByText } = render(
      <FormWrapperComponent
        config={{
          description: 'any-description-mock',
          id: 'any-id-mock',
          mentions: 'any-mentions-text-mock',
          noRequired: false,
          title: 'any-title-mock',
          titleHeading: HeadingTag.H6,
        }}
        handleSubmit={handleSubmitMock}
        submitError="any-submit-error-mock"
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );
    const formElt = getByTestId('any-id-mock--testid');
    const childrenElt = getByText('any-children-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(formElt).toBeInTheDocument();
    expect(formElt).toHaveAttribute('id', 'any-id-mock');
    expect(FormHeaderComponent).toHaveBeenCalledOnce();
    expect(FormHeaderComponent).toHaveBeenCalledWith(
      {
        description: 'any-description-mock',
        title: 'any-title-mock',
        titleHeading: HeadingTag.H6,
      },
      undefined,
    );
    expect(FormRequiredMessageComponent).toHaveBeenCalledOnce();
    expect(FormRequiredMessageComponent).toHaveBeenCalledWith({}, undefined);
    expect(childrenElt).toBeInTheDocument();
    expect(FormActionsComponent).toHaveBeenCalledOnce();
    expect(FormActionsComponent).toHaveBeenCalledWith(
      {
        canSubmit: true,
      },
      undefined,
    );
    expect(FormErrorComponent).toHaveBeenCalledOnce();
    expect(FormErrorComponent).toHaveBeenCalledWith({ error: 'any-submit-error-mock' }, undefined);
    expect(FormMentionsComponent).toHaveBeenCalledOnce();
    expect(FormMentionsComponent).toHaveBeenCalledWith(
      {
        content: 'any-mentions-text-mock',
      },
      undefined,
    );
    expect(FormErrorScrollComponent).toHaveBeenCalledOnce();
    expect(FormErrorScrollComponent).toHaveBeenCalledWith(
      { active: true, elementClassName: '.fr-message--error' },
      undefined,
    );
  });

  it('should match snapshot without description, title, submit label and a disable submit button', () => {
    // Given
    const handleSubmitMock = jest.fn();

    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container } = render(
      <FormWrapperComponent
        submitting
        config={{
          id: 'any-id-mock',
          noRequired: false,
        }}
        handleSubmit={handleSubmitMock}
        submitError="any-submit-error-mock">
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(FormHeaderComponent).not.toHaveBeenCalledOnce();
    expect(FormActionsComponent).toHaveBeenCalledWith(
      {
        canSubmit: false,
      },
      undefined,
    );
  });

  it('should not render all fields required message', () => {
    // Given
    const handleSubmitMock = jest.fn();

    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container } = render(
      <FormWrapperComponent
        config={{
          id: 'any-id-mock',
          noRequired: true,
        }}
        handleSubmit={handleSubmitMock}
        submitError="any-submit-error-mock"
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(FormRequiredMessageComponent).not.toHaveBeenCalledOnce();
  });

  it('should not render the error message', () => {
    // Given
    const handleSubmitMock = jest.fn();

    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container } = render(
      <FormWrapperComponent
        config={{
          id: 'any-id-mock',
          noRequired: true,
        }}
        handleSubmit={handleSubmitMock}
        submitError={undefined}
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(FormErrorComponent).not.toHaveBeenCalledOnce();
  });

  it('should not render the error scroll component', () => {
    // Given
    const handleSubmitMock = jest.fn();

    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container } = render(
      <FormWrapperComponent
        config={{
          id: 'any-id-mock',
          noRequired: true,
          scrollTopOnSubmit: false,
        }}
        handleSubmit={handleSubmitMock}
        submitError={undefined}
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(FormErrorScrollComponent).toHaveBeenCalledOnce();
    expect(FormErrorScrollComponent).toHaveBeenCalledWith(
      { active: false, elementClassName: '.fr-message--error' },
      undefined,
    );
  });

  it('should call FormActionsComponent with defined actions', () => {
    // Given
    const handleSubmitMock = jest.fn();
    const childrenMock = <div>any-children-mock</div>;
    const formActionsMock = Symbol('form-actions-mock') as unknown as FormActionsInterface[];

    // When
    render(
      <FormWrapperComponent
        config={{
          actions: formActionsMock,
          id: 'any-id-mock',
          noRequired: true,
        }}
        handleSubmit={handleSubmitMock}
        submitError={undefined}
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(FormActionsComponent).toHaveBeenCalledWith(
      {
        actions: formActionsMock,
        canSubmit: true,
      },
      undefined,
    );
  });
});
