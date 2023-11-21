import { render } from '@testing-library/react';

import { NoResultComponent } from './no-result.component';

describe('NoResultComponent', () => {
  it('should return a message when MonComptePro is not available', () => {
    // when
    const { getByText } = render(<NoResultComponent isMoncompteProAvailable={false} />);
    const message = getByText('Aucun fournisseur d’identité n’a été trouvé');

    // then
    expect(message).toBeInTheDocument();
  });

  it('should return a different message when MonComptePro is available', () => {
    const expectedTitle = 'Nous ne trouvons pas votre administration';
    const expectedSubtext = 'Vous pouvez continuer en utilisant MonComptePro';

    // when
    const { getByText } = render(<NoResultComponent isMoncompteProAvailable />);
    const title = getByText(expectedTitle);
    const subtext = getByText(expectedSubtext);

    // then
    expect(title).toBeInTheDocument();
    expect(subtext).toBeInTheDocument();
  });
});
