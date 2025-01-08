import { render } from '@testing-library/react';

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
        scrollTopOnSubmit
        config={{
          description: 'any-description-mock',
          id: 'any-id-mock',
          title: 'any-title-mock',
        }}
        handleSubmit={handleSubmitMock}
        noRequired={false}
        pristine={false}
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
      },
      {},
    );
    expect(FormRequiredMessageComponent).toHaveBeenCalledOnce();
    expect(FormRequiredMessageComponent).toHaveBeenCalledWith({}, {});
    expect(childrenElt).toBeInTheDocument();
    expect(FormActionsComponent).toHaveBeenCalledOnce();
    expect(FormActionsComponent).toHaveBeenCalledWith(
      {
        canSubmit: true,
      },
      {},
    );
    expect(FormErrorComponent).toHaveBeenCalledOnce();
    expect(FormErrorComponent).toHaveBeenCalledWith({ error: 'any-submit-error-mock' }, {});
    expect(FormMentionsComponent).toHaveBeenCalledOnce();
    expect(FormMentionsComponent).toHaveBeenCalledWith({}, {});
    expect(FormErrorScrollComponent).toHaveBeenCalledOnce();
    expect(FormErrorScrollComponent).toHaveBeenCalledWith({}, {});
  });

  it('should match snapshot without description dans title', () => {
    // Given
    const handleSubmitMock = jest.fn();

    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container } = render(
      <FormWrapperComponent
        scrollTopOnSubmit
        config={{
          id: 'any-id-mock',
        }}
        handleSubmit={handleSubmitMock}
        noRequired={false}
        pristine={false}
        submitError="any-submit-error-mock"
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(FormHeaderComponent).not.toHaveBeenCalledOnce();
  });

  it('should not render all fields required message', () => {
    // Given
    const handleSubmitMock = jest.fn();

    const childrenMock = <div>any-children-mock</div>;

    // When
    const { container } = render(
      <FormWrapperComponent
        noRequired
        scrollTopOnSubmit
        config={{
          id: 'any-id-mock',
        }}
        handleSubmit={handleSubmitMock}
        pristine={false}
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
        noRequired
        scrollTopOnSubmit
        config={{
          id: 'any-id-mock',
        }}
        handleSubmit={handleSubmitMock}
        pristine={false}
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
        noRequired
        config={{
          id: 'any-id-mock',
        }}
        handleSubmit={handleSubmitMock}
        pristine={false}
        scrollTopOnSubmit={false}
        submitError={undefined}
        submitting={false}>
        {childrenMock}
      </FormWrapperComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(FormErrorScrollComponent).not.toHaveBeenCalledOnce();
  });
});
