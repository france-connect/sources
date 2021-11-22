import axios from 'axios';
import queryString from 'query-string';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RiArrowGoBackFill as BackIcon } from 'react-icons/ri';

import './return.scss';

export const ReturnButtonComponent = () => {
  const mounted = useRef(false);

  const [showButton, setShowButton] = useState(false);
  const [historyBackURL, setHistoryBackURL] = useState('');
  const [serviceProviderName, setServiceProviderName] = useState(null);

  const errorHandler = useCallback(() => {
    setShowButton(false);
  }, []);

  const responseHandler = useCallback(({ data }) => {
    const { redirectURI, redirectURIQuery, spName } = data;
    const query = queryString.stringify(redirectURIQuery);
    const nextHistoryBackURL = `${redirectURI}?${query}`;
    setHistoryBackURL(nextHistoryBackURL);
    setServiceProviderName(spName);
    setShowButton(true);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const url = '/api/v2/history-back-url';
      axios.get(url).then(responseHandler).catch(errorHandler);
    }
  });

  if (!showButton) {
    return <span />;
  }
  return (
    <a
      className="button flex-columns items-center no-underline flex-end"
      href={historyBackURL}
      title="retourner à l'écran précédent"
    >
      <i className="icon is-block mr8 p5">
        <BackIcon />
      </i>
      <span>Revenir sur {serviceProviderName}</span>
    </a>
  );
};

ReturnButtonComponent.defaultProps = {
  className: '',
};

ReturnButtonComponent.displayName = 'ReturnButtonComponent';
