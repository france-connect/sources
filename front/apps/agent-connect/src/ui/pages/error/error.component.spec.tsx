import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { ErrorComponent } from './error.component';

const errorMock = {
  code: 'any-error-code',
  id: 'any-error-id',
  message: 'any-error-message',
};

describe('ErrorComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have call useMediaQuery with params', () => {
    // when
    render(<ErrorComponent errors={errorMock} />);
    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should match the snapshot for a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(<ErrorComponent errors={errorMock} />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<ErrorComponent errors={errorMock} />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should render "any-error-message" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('any-error-message');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "any-error-code" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('any-error-code');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "any-error-id" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('any-error-id');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Une erreur est survenue lors de la connexion." text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('Une erreur est survenue lors de la connexion.');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Description de l’erreur" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('Description de l’erreur :');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Que faire ?" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('Que faire ?');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Fermez l’onglet de votre navigateur..." text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText(
      'Fermez l’onglet de votre navigateur et reconnectez-vous en cliquant sur le bouton AgentConnect.',
    );
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Contactez le support...." text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('Contactez le support de votre service si le problème persiste.');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Informations à nous transmettre...." text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText(
      'Informations à nous transmettre dans le mail pour faciliter la prise en charge de votre demande :',
    );
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "Code d’erreur" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('Code d’erreur :');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should render "ID" text', () => {
    // when
    const { getByText } = render(<ErrorComponent errors={errorMock} />);
    const element = getByText('ID :');
    // then
    expect(element).toBeInTheDocument();
  });
});
