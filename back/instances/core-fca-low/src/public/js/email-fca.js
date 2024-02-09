const LOCAL_STORAGE_MAIL = 'agentConnectEmail';

function init() {
  const input = document.querySelector('#email-input');
  const button = document.querySelector('#email-submit-button');

  const agentConnectEmail = localStorage.getItem(LOCAL_STORAGE_MAIL);
  if(agentConnectEmail) {
    input.value = agentConnectEmail;
  };

  button.addEventListener("click", () => {
    localStorage.setItem(LOCAL_STORAGE_MAIL, input.value);
  });
}

init();
