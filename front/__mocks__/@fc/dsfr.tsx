export const FranceConnectButton = jest.fn(() => <div>FranceConnectButton</div>);

export const SimpleButton = jest.fn(() => <div>SimpleButton</div>);

export const CheckboxInput = jest.fn(() => <div>CheckboxInput</div>);

export const ToggleInput = jest.fn(() => <div>ToggleInput</div>);

export const ApplicationLayout = jest.fn(() => <div>ApplicationLayout</div>);

export const LinkComponent = jest.fn(() => <div>LinkComponent</div>);

export const SearchBarComponent = jest.fn(() => <div>SearchBarComponent</div>);

export const BadgeComponent = jest.fn(() => <div>BadgeComponent</div>);

export const AlertComponent = jest.fn(({ children }) => (
  <div data-mockid={'AlertComponent'}>
    <div>AlertComponent</div>
    <div>{children}</div>
  </div>
));

export const PaginationComponent = jest.fn(() => <div>PaginationComponent</div>);

export const AccordionComponent = jest.fn(({ children }) => (
  <div data-mockid={'AccordionComponent'}>
    <h3>AccordionComponent</h3>
    <div>{children}</div>
  </div>
));

export const AccordionGroupComponent = jest.fn(({ children }) => (
  <div data-mockid={'AccordionGroupComponent'}>
    <h3>AccordionGroupComponent</h3>
    <div>{children}</div>
  </div>
));

export const Breakpoints = {
  LG: 1248,
  MD: 992,
  SM: 768,
  XS: 576,
};

export const Sizes = {
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
};

export const AlertTypes = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
};

export const IconPlacement = {
  LEFT: 'left',
  RIGHT: 'right',
};

export const Priorities = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

export const ButtonTypes = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
};
