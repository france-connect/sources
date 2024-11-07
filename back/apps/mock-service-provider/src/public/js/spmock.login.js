function getScopes() {
  const selectedScopes = [];
  document
    .querySelectorAll('input[name="selected-scope"]:checked')
    .forEach((elem) => selectedScopes.push(elem.value));

  return selectedScopes.join(' ');
}

function updateScope() {
  const scope = getScopes();
  document.getElementById('scope').value = scope;
}

function toggleAcrValues() {
  const selector = 'input[name="activate-acr-values"]';
  const toggle = document.querySelector(selector);
  const acrValues = document.getElementById('acrValues');
  acrValues.disabled = !toggle.checked;
  const acrSelector = document.getElementById('acrSelector');
  acrSelector.disabled = !toggle.checked;
}

function updateAcr() {
  const acr = document.getElementById('acrSelector').value;
  document.getElementById('acrValues').value = acr;
}

function getClaims() {
  const selector = 'input[name="selected-claim"]:checked';
  const elements = [...document.querySelectorAll(selector)];
  return elements.map((elem) => elem.value);
}

function updateClaim() {
  const claims = getClaims();
  const claimsAreValid = claims && claims.length > 0;
  const json = !claimsAreValid ? '' : transformClaimsToJsonString(claims);
  document.getElementById('claims').value = json;
}

function togglePrompt() {
  const selector = 'input[name="activate-prompt"]';
  const toggle = document.querySelector(selector);
  const prompt = document.getElementById('prompt');
  prompt.disabled = !toggle.checked;
}

function getPrompt() {
  const selector = 'input[name="selected-prompt"]:checked';
  const elements = [...document.querySelectorAll(selector)];
  return elements.map((elem) => elem.value);
}

function updatePrompt() {
  const prompt = getPrompt();
  const promptAreValid = prompt && prompt.length > 0;
  document.getElementById('prompt').value = promptAreValid
    ? prompt.join(' ')
    : '';
}

function changeHttpMethod() {
  const httpMethod = document.getElementById('httpMethod').value;
  document.forms['authorizeForm'].method = httpMethod;
}

function transformClaimsToJsonString(claims) {
  const values = claims.reduce(
    (acc, key) => ({ ...acc, [key]: { essential: true } }),
    {},
  );
  const json = JSON.stringify({ id_token: values });
  return json;
}

function init() {
  var mode = document.getElementById('modeForm').elements['mode'].value;
  if (mode === 'advanced') {
    updateAcr();
    updateClaim();
    updatePrompt();
  }
  updateScope();
}

init();
