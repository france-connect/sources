window.$crisp = [
  [
    'set',
    'session:segments',
    [['chat', 'website', 'federation', window.location.host]],
  ],
];
window.CRISP_WEBSITE_ID = 'd1d5816e-314a-45e4-9715-144347b1039a';
(function () {
  d = document;
  s = d.createElement('script');
  s.src = 'https://client.crisp.chat/l.js';
  s.async = 1;
  d.getElementsByTagName('head')[0].appendChild(s);
})();
