export const StepperContext = jest.fn();

export const useStepperNavigation = jest.fn();

export const StepperContextProvider = jest.fn(() => <div>StepperContextProvider</div>);

export const LinkButton = jest.fn(() => <div>LinkButton</div>);

export const SimpleButton = jest.fn(() => <div>SimpleButton</div>);

export const CheckboxInput = jest.fn(() => <div>CheckboxInput</div>);

export const ToggleInput = jest.fn(() => <div>ToggleInput</div>);

export const LinkComponent = jest.fn(({ label }) => (
  <span data-mockid="LinkComponent">{label}</span>
));

export const CardComponent = jest.fn(({ children }) => (
  <div data-mockid="CardComponent">{children}</div>
));

export const TileComponent = jest.fn(() => <div>TileComponent</div>);

export const TableComponent = jest.fn(() => <div>TableComponent</div>);

export const NoticeComponent = jest.fn(() => <div>NoticeComponent</div>);

export const SearchBarComponent = jest.fn(() => <div>SearchBarComponent</div>);

export const BadgeComponent = jest.fn(() => <div>BadgeComponent</div>);

export const BreadCrumbsComponent = jest.fn(() => <div>BreadCrumbsComponent</div>);

export const BadgesGroupComponent = jest.fn(() => <div>BadgesGroupComponent</div>);

export const PaginationComponent = jest.fn(() => <div>PaginationComponent</div>);

export const LogoRepubliqueFrancaiseComponent = jest.fn(() => (
  <div>LogoRepubliqueFrancaiseComponent</div>
));

export const CalloutComponent = jest.fn(({ children }) => (
  <div data-mockid="CalloutComponent">
    <div>CalloutComponent</div>
    <div>{children}</div>
  </div>
));

export const AlertComponent = jest.fn(({ children }) => (
  <div data-mockid="AlertComponent">
    <div>AlertComponent</div>
    <div>{children}</div>
  </div>
));

export const AccordionComponent = jest.fn(({ children }) => (
  <div data-mockid="AccordionComponent">
    <h3>AccordionComponent</h3>
    <div>{children}</div>
  </div>
));

export const AccordionGroupComponent = jest.fn(({ children }) => (
  <div data-mockid="AccordionGroupComponent">
    <h3>AccordionGroupComponent</h3>
    <div>{children}</div>
  </div>
));

export const LoginConnectComponent = jest.fn(({ type }) => (
  <div data-mockid="LoginConnectComponent">
    <div>{type}</div>
    <div>LoginConnectComponent</div>
  </div>
));

export const Options = {
  CONFIG_NAME_STEPPER: 'Stepper',
};

export const ConnectTypes = {
  FRANCE_CONNECT: 'FranceConnect',
  PRO_CONNECT: 'ProConnect',
};

export const Sizes = {
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
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
