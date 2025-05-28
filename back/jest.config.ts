import type { Config } from 'jest';

const config: Config = {
  setupFiles: ['./jest-setup-file.ts'],
  setupFilesAfterEnv: ['jest-extended/all'],
  collectCoverageFrom: ['libs/**/*.ts', 'apps/**/*.ts', 'instances/**/*.ts'],
  coveragePathIgnorePatterns: [
    'instances/.+/src/config/.+.ts',
    'instances/.+/src/main.ts',
    '.mocks/',
    '.+/index.ts',
    '.+.(config|descriptor|dto|enum|fixture|i18n|interface|module|override|plugin|provider|schema|type|token).ts',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/', '<rootDir>/libs/', '<rootDir>/instances/'],
  moduleNameMapper: {
    '^jose/(.*)$': '<rootDir>/node_modules/jose/dist/node/cjs/$1',
    '^jose-openid-client(|/.*)$':
      '<rootDir>node_modules/openid-client/node_modules/jose$1',
    '@entities/(.*)': '<rootDir>/entities/$1',
    '^@fc/user-dashboard(|/.*)$': '<rootDir>/apps/user-dashboard/src$1',
    '^@fc/core-fcp(|/.*)$': '<rootDir>/apps/core-fcp/src$1',
    '^@fc/csmr-hsm(|/.*)$': '<rootDir>/apps/csmr-hsm/src$1',
    '^@fc/csmr-hsm-client(|/.*)$': '<rootDir>/libs/csmr-hsm-client/src/$1',
    '^@fc/mock-service-provider(|/.*)$':
      '<rootDir>/apps/mock-service-provider/src$1',
    '^@fc/eidas-bridge(|/.*)$': '<rootDir>/apps/eidas-bridge/src$1',
    '^@fc/rnipp(|/.*)$': '<rootDir>/libs/rnipp/src$1',
    '^@fc/identity-provider-adapter-env(|/.*)$':
      '<rootDir>/libs/identity-provider-adapter-env/src$1',
    '^@fc/identity-provider-adapter-mongo(|/.*)$':
      '<rootDir>/libs/identity-provider-adapter-mongo/src$1',
    '^@fc/data-provider-adapter-mongo(|/.*)$':
      '<rootDir>/libs/data-provider-adapter-mongo/src$1',
    '^@fc/identity(|/.*)$': '<rootDir>/libs/identity/src$1',
    '^@fc/service-provider-adapter-env(|/.*)$':
      '<rootDir>/libs/service-provider-adapter-env/src$1',
    '^@fc/service-provider-adapter-mongo(|/.*)$':
      '<rootDir>/libs/service-provider-adapter-mongo/src$1',
    '^@fc/logger-legacy(|/.*)$': '<rootDir>/libs/logger-legacy/src$1',
    '^@mocks/logger-legacy(|/.*)$': '<rootDir>/libs/logger-legacy/.mocks$1',
    '^@fc/logger(|/.*)$': '<rootDir>/libs/logger/src$1',
    '^@mocks/logger(|/.*)$': '<rootDir>/libs/logger/.mocks$1',
    '^@fc/oidc-provider(|/.*)$': '<rootDir>/libs/oidc-provider/src$1',
    '^@fc/oidc-client(|/.*)$': '<rootDir>/libs/oidc-client/src$1',
    '^@fc/cryptography-fcp(|/.*)$': '<rootDir>/libs/cryptography-fcp/src$1',
    '^@fc/cryptography-eidas(|/.*)$': '<rootDir>/libs/cryptography-eidas/src$1',
    '^@fc/cryptography(|/.*)$': '<rootDir>/libs/cryptography/src$1',
    '^@fc/core(|/.*)$': '<rootDir>/libs/core/src$1',
    '^@fc/core-fcp-logger(|/.*)$': '<rootDir>/libs/core-fcp-logger/src$1',
    '^@fc/common(|/.*)$': '<rootDir>/libs/common/src$1',
    '^@fc/cryptography-gateway-low(|/.*)$':
      '<rootDir>/libs/cryptography-gateway-low/src$1',
    '^@fc/cryptography-gateway-high(|/.*)$':
      '<rootDir>/libs/cryptography-gateway-high/src$1',
    '^@fc/config(|/.*)$': '<rootDir>/libs/config/src$1',
    '^@mocks/config(|/.*)$': '<rootDir>/libs/config/.mocks$1',
    '^@fc/exceptions-fcp(|/.*)$': '<rootDir>/libs/exceptions-fcp/src$1',
    '^@fc/mongoose(|/.*)$': '<rootDir>/libs/mongoose/src$1',
    '^@fc/redis(|/.*)$': '<rootDir>/libs/redis/src$1',
    '^@mocks/redis(|/.*)$': '<rootDir>/libs/redis/.mocks$1',
    '^@fc/rabbitmq(|/.*)$': '<rootDir>/libs/rabbitmq/src$1',
    '^@fc/hsm(|/.*)$': '<rootDir>/libs/hsm/src$1',
    '^@fc/microservices(|/.*)$': '<rootDir>/libs/microservices/src$1',
    '^@fc/account(|/.*)$': '<rootDir>/libs/account/src$1',
    '^@fc/oidc(|/.*)$': '<rootDir>/libs/oidc/src$1',
    '^@fc/http-proxy(|/.*)$': '<rootDir>/libs/http-proxy/src$1',
    '^@fc/session(|/.*)$': '<rootDir>/libs/session/src$1',
    '^@fc/override-oidc-provider(|/.*)$':
      '<rootDir>/libs/override-oidc-provider/src$1',
    '^@fc/mailer(|/.*)$': '<rootDir>/libs/mailer/src$1',
    '^@fc/tracking-context(|/.*)$': '<rootDir>/libs/tracking-context/src$1',
    '^@fc/tracking(|/.*)$': '<rootDir>/libs/tracking/src$1',
    '^@fc/app(|/.*)$': '<rootDir>/libs/app/src$1',
    '^@fc/eidas-light-protocol(|/.*)$':
      '<rootDir>/libs/eidas-light-protocol/src$1',
    '^@fc/cog(|/.*)$': '<rootDir>/libs/cog/src$1',
    '^@fc/eidas-country(|/.*)$': '<rootDir>/libs/eidas-country/src$1',
    '^@fc/eidas-client(|/.*)$': '<rootDir>/libs/eidas-client/src$1',
    '^@fc/apache-ignite(|/.*)$': '<rootDir>/libs/apache-ignite/src$1',
    '^@fc/eidas-provider(|/.*)$': '<rootDir>/libs/eidas-provider/src$1',
    '^@fc/eidas-oidc-mapper(|/.*)$': '<rootDir>/libs/eidas-oidc-mapper/src$1',
    '^@fc/eidas(|/.*)$': '<rootDir>/libs/eidas/src$1',
    '^@fc/notifications(|/.*)$': '<rootDir>/libs/notifications/src$1',
    '^@fc/scopes(|/.*)$': '<rootDir>/libs/scopes/src$1',
    '^@fc/feature-handler(|/.*)$': '<rootDir>/libs/feature-handler/src$1',
    '^@fc/elasticsearch(|/.*)$': '<rootDir>/libs/elasticsearch/src$1',
    '^@fc/csv(|/.*)$': '<rootDir>/libs/csv/src/$1',
    '^@fc/csmr-user-preferences(|/.*)$':
      '<rootDir>/apps/csmr-user-preferences/src$1',
    '^@fc/data-provider-core-auth(|/.*)$':
      '<rootDir>/libs/data-provider-core-auth/src/$1',
    '^@fc/csmr-tracks-client(|/.*)$':
      '<rootDir>/libs/csmr-tracks-client/src/$1',
    '^@fc/csmr-fraud-client(|/.*)$': '<rootDir>/libs/csmr-fraud-client/src/$1',
    '^@fc/csmr-import-core-client(|/.*)$':
      '<rootDir>/libs/csmr-import-core-client/src/$1',
    '^@fc/csmr-account-client(|/.*)$':
      '<rootDir>/libs/csmr-account-client/src/$1',
    '^@fc/tracks-adapter-elasticsearch(|/.*)$':
      '<rootDir>/libs/tracks-adapter-elasticsearch/src/$1',
    '^@fc/user-preferences(|/.*)$': '<rootDir>/libs/user-preferences/src$1',
    '^@fc/csmr-tracks(|/.*)$': '<rootDir>/apps/csmr-tracks/src/$1',
    '^@fc/csmr-account(|/.*)$': '<rootDir>/apps/csmr-account/src/$1',
    '^@fc/csmr-fraud(|/.*)$': '<rootDir>/apps/csmr-fraud/src/$1',
    '^@fc/csmr-import-core(|/.*)$': '<rootDir>/apps/csmr-import-core/src/$1',
    '^@fc/mock-rnipp(|/.*)$': '<rootDir>/apps/mock-rnipp/src/$1',
    '^@fc/oidc-acr(|/.*)$': '<rootDir>/libs/oidc-acr/src/$1',
    '^@fc/flow-steps(|/.*)$': '<rootDir>/libs/flow-steps/src/$1',
    '^@fc/mock-data-provider(|/.*)$':
      '<rootDir>/apps/mock-data-provider/src/$1',
    '^@fc/mock-identity-provider(|/.*)$':
      '<rootDir>/apps/mock-identity-provider/src/$1',
    '^@fc/data-provider-adapter-core(|/.*)$':
      '<rootDir>/libs/data-provider-adapter-core/src/$1',
    '^@mocks/session(|/.*)$': '<rootDir>/libs/session/.mocks/$1',
    '^@fc/jwt(|/.*)$': '<rootDir>/libs/jwt/src/$1',
    '^@mocks/jwt(|/.*)$': '<rootDir>/libs/jwt/.mocks/$1',
    '^@fc/async-local-storage(|/.*)$':
      '<rootDir>/libs/async-local-storage/src/$1',
    '^@mocks/async-local-storage(|/.*)$':
      '<rootDir>/libs/async-local-storage/.mocks$1',
    '^@fc/view-templates(|/.*)$': '<rootDir>/libs/view-templates/src/$1',
    '^@mocks/core(|/.*)$': '<rootDir>/libs/core/.mocks/$1',
    '^@fc/csrf(|/.*)$': '<rootDir>/libs/csrf/src/$1',
    '^@fc/exceptions(|/.*)$': '<rootDir>/libs/exceptions/src/$1',
    '^@fc/i18n(|/.*)$': '<rootDir>/libs/i18n/src/$1',
    '^@mocks/i18n(|/.*)$': '<rootDir>/libs/i18n/.mocks$1',
    '^@fc/partners(|/.*)$': '<rootDir>/apps/partners/src/$1',
    '^@fc/device(|/.*)$': '<rootDir>/libs/device/src/$1',
    '^@fc/dto2form(|/.*)$': '<rootDir>/libs/dto2form/src/$1',
    '^@mocks/dto2form(|/.*)$': '<rootDir>/libs/dto2form/.mocks/$1',
    '^@fc/logger-plugins(|/.*)$': '<rootDir>/libs/logger-plugins/src/$1',
    '^@mocks/common(|/.*)$': '<rootDir>/libs/common/.mocks/$1',
    '^@mocks/typeorm(|/.*)$': '<rootDir>/libs/typeorm/.mocks/$1',
    '^@fc/typeorm(|/.*)$': '<rootDir>/libs/typeorm/src/$1',
    '^@fc/postgres(|/.*)$': '<rootDir>/libs/postgres/src/$1',
    '^@fc/partners-account(|/.*)$': '<rootDir>/libs/partners-account/src/$1',
    '^@fc/partners-organisation(|/.*)$':
      '<rootDir>/libs/partners-organisation/src/$1',
    '^@fc/partners-service-provider(|/.*)$':
      '<rootDir>/libs/partners-service-provider/src/$1',
    '^@fc/partners-service-provider-instance(|/.*)$':
      '<rootDir>/libs/partners-service-provider-instance/src/$1',
    '^@fc/partners-service-provider-instance-version(|/.*)$':
      '<rootDir>/libs/partners-service-provider-instance-version/src/$1',
    '^@fc/access-control(|/.*)$': '<rootDir>/libs/access-control/src/$1',
    '^@fc/microservices-rmq(|/.*)$': '<rootDir>/libs/microservices-rmq/src/$1',
    '^@mocks/microservices-rmq(|/.*)$':
      '<rootDir>/libs/microservices-rmq/.mocks/$1',
    '^@fc/csmr-config-client(|/.*)$':
      '<rootDir>/libs/csmr-config-client/src/$1',
    '^@fc/config-abstract-adapter(|/.*)$':
      '<rootDir>/libs/config-abstract-adapter/src/$1',
    '^@fc/config-mongo-adapter(|/.*)$':
      '<rootDir>/libs/config-mongo-adapter/src/$1',
    '^@fc/config-postgres-adapter(|/.*)$':
      '<rootDir>/libs/config-postgres-adapter/src/$1',
    '^@fc/csmr-config(|/.*)$': '<rootDir>/apps/csmr-config/src/$1',
    '^@fc/csmr-config-sandbox-low(|/.*)$':
      '<rootDir>/apps/csmr-config-sandbox-low/src/$1',
    '^@fc/csmr-config-partners(|/.*)$':
      '<rootDir>/apps/csmr-config-partners/src/$1',
    '^@fc/service-partners(|/.*)$': '<rootDir>/apps/service-partners/src/$1',
    '^@fc/service-provider(|/.*)$': '<rootDir>/libs/service-provider/src/$1',
    '^@fc/override-code(|/.*)$': '<rootDir>/libs/override-code/src/$1',
    '^@fc/csmr-proxy-client(|/.*)$': '<rootDir>/libs/csmr-proxy-client/src/$1',
    '^oidc-provider(|/.*)$': '<rootDir>/libs/oidc-provider/mocks/lib/$1',
  },
  preset: 'ts-jest',
};

export default config;
