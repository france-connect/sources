import axios from 'axios';
import classNames from 'classnames'
import { useMediaQuery } from 'react-responsive';

import queryString from 'query-string';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RiArrowLeftLine as BackIcon } from 'react-icons/ri';

import './return.scss';

export const ReturnButtonComponent = () => {
  const mounted = useRef(false);

  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });

  const [showButton, setShowButton] = useState(true);
  const [historyBackURL, setHistoryBackURL] = useState('/');
  const [serviceProviderName, setServiceProviderName] = useState("FSA - FSA1-LOW");

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
      className={classNames("button flex-columns items-center no-underline px12", { "flex-end": isTablet, "is-mobile": !isTablet, "bg-g200": !isTablet, "m16": !isTablet })}
      href={historyBackURL}
      title="retourner à l'écran précédent"
    >
      <i className="is-block mr8 p5">
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
