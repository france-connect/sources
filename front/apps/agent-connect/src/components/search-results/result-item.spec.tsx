/* ****************************************************

 !!! DISCLAIMER !!!

 Error: Not implemented: HTMLFormElement.prototype.submit

 -> JSDom library do not manage HTMLForm publish
 -> @TODO find a stronger solution to mock JSDom virtual console, with a plugin
    https://github.com/jsdom/jsdom/issues/1937#issuecomment-526162324

**************************************************** */
import { mocked } from 'ts-jest/utils';

import { choosenIdentityProvider } from '../../redux/actions';
import { fireEvent, renderWithRedux } from '../../testUtils';
import { IdentityProvidersHistoryAction } from '../../types';
import ResultItem from './result-item';

jest.mock('../../redux/actions');

// setup
const props = {
  identityProvider: {
    active: true,
    display: true,
    name: 'mock-name',
    uid: 'mock-uid',
  },
};

const initialState = {
  redirectToIdentityProviderInputs: {
    mockInput1: 'mock-input-1',
    mockInput2: 'mock-input-2',
    mockInput3: 'mock-input-3',
  },
  redirectURL: 'mock-form-url',
};

describe('ResultItem', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('form element', () => {
    it('should have method post and action from store', () => {
      // action
      const { getByRole } = renderWithRedux(<ResultItem {...props} />, {
        initialState,
      });
      const formElement = getByRole('form');
      // expect
      expect(formElement).toBeInTheDocument();
      expect(formElement).toHaveAttribute('method', 'POST');
      expect(formElement).toHaveAttribute('action', 'mock-form-url');
    });
  });

  describe('submit button', () => {
    it('should render a button with the mock name', () => {
      // action
      const { getByText } = renderWithRedux(<ResultItem {...props} />, {
        initialState,
      });
      const submitElement = getByText('mock-name');
      // expect
      expect(submitElement).toBeInTheDocument();
      expect(submitElement).not.toBeDisabled();
      expect(submitElement).toHaveAttribute('type', 'submit');
    });

    it('should render a disabled button with the mock name', () => {
      // setup
      const identityProvider = {
        ...props.identityProvider,
        active: false,
      };
      // action
      const { getByText } = renderWithRedux(
        <ResultItem identityProvider={identityProvider} />,
        {
          initialState,
        },
      );
      const submitElement = getByText('mock-name');
      // expect
      expect(submitElement).toBeInTheDocument();
      expect(submitElement).toBeDisabled();
      expect(submitElement).toHaveAttribute('type', 'submit');
    });

    it('should call choosenIdentityProvider redux action', () => {
      // setup
      const action = {
        type: 'mock-action-type',
      } as IdentityProvidersHistoryAction;

      const spy = mocked(choosenIdentityProvider, true);
      spy.mockReturnValueOnce(action);

      // action
      const { getByText } = renderWithRedux(<ResultItem {...props} />, {
        initialState,
      });

      const submitElement = getByText('mock-name');
      fireEvent.click(submitElement);
      // expect
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('hidden inputs', () => {
    it('should render hidden inputs from the redux store', () => {
      // action
      const { getByDisplayValue } = renderWithRedux(<ResultItem {...props} />, {
        initialState,
      });
      // expect
      const inputElement1 = getByDisplayValue('mock-input-1');
      expect(inputElement1).toBeInTheDocument();
      expect(inputElement1).toHaveAttribute('name', 'mockInput1');
      expect(inputElement1).toHaveAttribute('type', 'hidden');

      const inputElement2 = getByDisplayValue('mock-input-2');
      expect(inputElement2).toBeInTheDocument();
      expect(inputElement2).toHaveAttribute('name', 'mockInput2');
      expect(inputElement2).toHaveAttribute('type', 'hidden');

      const inputElement3 = getByDisplayValue('mock-input-3');
      expect(inputElement3).toBeInTheDocument();
      expect(inputElement3).toHaveAttribute('name', 'mockInput3');
      expect(inputElement3).toHaveAttribute('type', 'hidden');
    });
  });

  describe('providerUid hidden input', () => {
    it('should have an hidden input with value from the identityProvider', () => {
      // action
      const { getByDisplayValue } = renderWithRedux(<ResultItem {...props} />, {
        initialState,
      });
      // expect
      const inputElement3 = getByDisplayValue('mock-uid');
      expect(inputElement3).toBeInTheDocument();
      expect(inputElement3).toHaveAttribute('name', 'providerUid');
      expect(inputElement3).toHaveAttribute('type', 'hidden');
    });
  });
});
