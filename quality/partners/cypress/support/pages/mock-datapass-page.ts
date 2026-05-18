import { getUserByDescription } from '../helpers';
import {
  ChainableElement,
  DatapassEvent,
  ServiceProvider,
  UserData,
} from '../types';

export default class MockDatapassPage {
  getPayloadTextarea(): ChainableElement {
    return cy.get('[data-testid="mock-datapass-payload-textarea"]');
  }

  getSubmitButton(): ChainableElement {
    return cy.get('[data-testid="mock-datapass-send-button"]');
  }

  getResponseStatusCodeLabel(): ChainableElement {
    return cy.get('[data-testid="mock-datapass-response-status-code"]');
  }

  getResponseBodyLabel(): ChainableElement {
    return cy.get('[data-testid="mock-datapass-response-body"]');
  }

  fillPayload(
    basePayload: DatapassEvent,
    serviceProvider: ServiceProvider,
    users: UserData[],
  ): void {
    const payload = getPayloadWithServiceProviderData(
      basePayload,
      serviceProvider,
      users,
    );
    this.getPayloadTextarea().clearThenType(JSON.stringify(payload));
  }
}

// Functions to build dynamic Datapass webhook payload

const getApplicantUserData = (user: UserData): Record<string, string> => {
  return {
    email: user.claims.email,
    family_name: user.claims.usual_name,
    given_name: user.claims.given_name,
    phone_number: user.claims.phone_number,
  };
};

const getTechnicalUserData = (user: UserData): Record<string, string> => {
  return {
    // Datapass payload
    // eslint-disable-next-line @typescript-eslint/naming-convention
    contact_technique_email: user.claims.email,
    // Datapass payload
    // eslint-disable-next-line @typescript-eslint/naming-convention
    contact_technique_family_name: user.claims.usual_name,
    // Datapass payload
    // eslint-disable-next-line @typescript-eslint/naming-convention
    contact_technique_given_name: user.claims.given_name,
    // Datapass payload
    // eslint-disable-next-line @typescript-eslint/naming-convention
    contact_technique_phone_number: user.claims.phone_number,
  };
};

const getServiceProviderData = (
  serviceProvider: ServiceProvider,
): Record<string, string | string[]> => {
  return {
    // Datapass payload
    // eslint-disable-next-line @typescript-eslint/naming-convention
    france_connect_eidas: serviceProvider.datapassEidasLevel,
    intitule: serviceProvider.name,
    scopes: serviceProvider.datapassScopes,
  };
};

const getOrganizationData = (
  serviceProvider: ServiceProvider,
): Record<string, string> => {
  return {
    name: serviceProvider.organizationName,
    siret: serviceProvider.organizationSiret,
  };
};

const getPayloadWithServiceProviderData = (
  basePayload: DatapassEvent,
  serviceProvider: ServiceProvider,
  users: UserData[],
): DatapassEvent => {
  const applicantUser = getUserByDescription(
    users,
    serviceProvider.applicantUserDescription,
  );
  const technicalUser = getUserByDescription(
    users,
    serviceProvider.technicalUserDescription,
  );
  const payload = basePayload;
  payload.data.id = serviceProvider.datapassRequestId;
  payload.data.data = {
    ...payload.data.data,
    ...getServiceProviderData(serviceProvider),
    ...getTechnicalUserData(technicalUser),
  };
  payload.data.applicant = {
    ...payload.data.applicant,
    ...getApplicantUserData(applicantUser),
  };
  payload.data.organization = {
    ...payload.data.organization,
    ...getOrganizationData(serviceProvider),
  };
  const [currentAuthorization] = payload.data.authorizations;
  payload.data.authorizations[0] = {
    ...currentAuthorization,
    data: {
      ...currentAuthorization.data,
      ...getServiceProviderData(serviceProvider),
      ...getTechnicalUserData(technicalUser),
    },
    id: serviceProvider.datapassAuthorizationId,
  };

  return payload;
};
