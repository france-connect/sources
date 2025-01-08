import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given(
  /^j'utilise (?:une |l')instance de FS "([^"]+)"$/,
  function (description: string) {
    const instance = this.instances[description];
    expect(instance, `No instance matches the description '${description}'`).to
      .exist;
    this.instance = instance;
  },
);
