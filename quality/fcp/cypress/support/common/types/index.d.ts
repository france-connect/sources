import { Result } from 'axe-core';

import { type OperatorUser } from '../../exploitation/helpers';
import { type User } from '../helpers';
import { Email } from './email';
import { Environment } from './environment';
import { FraudFormValues } from './fraud-form-values';
import { IdentityProvider } from './identity-provider';
import { IdentityProviderConfig } from './identity-provider-config';
import { NotificationConfig } from './notification-config';
import { ScopeContext, ServiceProvider } from './service-provider';
import { ServiceProviderConfig } from './service-provider-config';
import { UserData } from './user';

// Cypress Alias
// eslint-disable-next-line no-undef
export type ChainableElement = Cypress.Chainable<JQuery<HTMLElement>>;

declare global {
  namespace Cypress {
    interface Chainable {
      // custom commands
      clearThenType(text: string, options?: Partial<Cypress.TypeOptions>): void;
    }
  }
}

// Define Cucumber world interface
declare module 'mocha' {
  export interface Context {
    // Accessibility context
    allViolations?: Result[];
    newViolations?: Result[];

    // API context
    apiRequests: Partial<Cypress.RequestOptions>[];
    apiRequest?: Partial<Cypress.RequestOptions>;

    // BDD context
    env: Environment;
    fraudFormValues?: FraudFormValues;
    identityProvider: IdentityProvider;
    identityProviders: IdentityProvider[];
    idpConfig?: IdentityProviderConfig;
    idpConfigs: IdentityProviderConfig[];
    notificationConfig?: NotificationConfig;
    mail?: Email;
    csvFiles: Record<string, Record<string, unknown>[]>;
    operatorUser?: OperatorUser;
    repScopes: ScopeContext[];
    repScope?: ScopeContext;
    requestedScope: ScopeContext;
    scopes: ScopeContext[];
    serviceProvider: ServiceProvider;
    serviceProviders: ServiceProvider[];
    spConfig?: ServiceProviderConfig;
    spConfigs: ServiceProviderConfig[];
    users: UserData[];
    user: User;
  }
}

export * from './email';
export * from './environment';
export * from './identity-provider';
export * from './identity-provider-config';
export * from './notification-config';
export * from './service-provider';
export * from './service-provider-config';
export * from './user';
