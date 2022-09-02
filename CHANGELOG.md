# Changelog

**⚠️ The format of the changelog is not fixed and will probably evolve as we work on the Open Source.**

**🔈 The odd versions are not released into production.**

## v3.105.0 && v3.106.0

- [UserDashboard] Fixed claim / label mapping that would cause the application to crash 🐛

## v3.103.0 && v3.104.0

🌴🌴🌴🌴🌴🌴 Nothing here because of holidays 🌴🌴🌴🌴🌴🌴

## v3.101.0 && v3.102.0

### Not yet in production (futures apps / features)

- [UserDashboard]
  - Implemented more BDD tests on the user login history page
  - Fixed an error regarding null claims on the user login history page
  - Added the future Yris IdP logo
  - Integrated the pagination component to the user login history page
  - Splitted a MongoDb consumer per platform (FranceConnect low and FranceConnect high level of assurance) to provide a better network isolation
  - Added a warning message when a user disables all his idp to ensure he has at least one idp to connect to
  - Added an information message in order for the user to explicitly decide whether or not the future IdPs should be authorized when starting to block IdPs in the user preferences.
## v3.99.0 && v3.100.0

### Cleaning & Tooling

- Referenced issues in severals `@todo` comments
- Added a [storyBook](https://storybook.js.org/) instance on dev stack, to ease React component development

### Not yet in production (futures apps / features)

- [UserDashboard]
  - Fixed multiple typos
  - Prevent users from disabling access to all Identity Providers
  - Enhanced users traces display
  - Moved email shipment from preferences consumer to UserDashboard backend
- Update Redux wrapper for all front app
- React Pagination component

## v3.97 && v3.98.0

### Fixes

- Fixed the way the docker-stack script retrieves NodeJS containers.

## v3.95 && v3.96.0

### Features

- [FranceConnect+] [AgentConnect]
  - Enhanced handling of business logs rotation

### Not yet in production (future apps / features)

- [Partners]

  - Simple login page

- [User Dashboard]

  - Enabled BDD tests execution on integration environment
  - Added BDD tests for user preferences management from administration applications

- [User Dashboard] [AgentConnect] [Partners]
  - Refactored react applications to use [official France Design System](https://www.systeme-de-design.gouv.fr/)

## v3.93.0 && v3.94.0

### Hardening & QA

- [AgentConnect] The `amr` claim is now tested with BDDs in the sandbox environment
- [User Dashboard] Visual regression testing has been implemented

### Not yet in production (futures apps / features

- [User Dashboard]
  - The user-preferences consumer can be used to fetch current user's preferences (for support application)
  - Human readable IdP name is now displayed instead of technical name on user connection history
  - IP location is now resolved at display time if not already present in user history
  - Scopes are now grouped by family on the backend in user's connection history page
- [Partners Dashboard]
  - Implemented first BDDs
  - Added CI configuration

## v3.91.0 && v3.92.0

### Features

- [AgentConnect]
  - Added `alg` property in jwks endpoints, to ease key selection for partners.

### Fixes

- Fixed a bug in unit tests making the CI unstable.

### Not yet in production (futures apps / features

- [User Dashboard]
  - Added explanations about idp management in user dashboard.
  - Styled the layout of the notification email for idp management.

## v3.89.0 & v3.90.0

### Fixes

- [AgentConnect]
  - Corrected a reflected XSS vulnerability

### Hardening & QA

- The `docker-stack start-all` command now tries to launch only available apps
- [User Dashboard]
  - Implemented BDD tests for the idp-settings feature

### Deprecated

- The `logger` library is now deprecated and will be reworked

### Not yet in production (futures apps / features)

- [User Dashboard]
  - The user information are now persistent when navigating with the URL
  - Limited to the minimum the identity scope that the dashboard has access to

## v3.87.0 & v3.88.0

### Fixes

- [FranceConnect+]
  - Added missing feature to fixtures
- Added missing fonts to build
- Added missing logos to docker-stack

### Hardening & QA

- Upgraded backend dependencies
- [AgentConnect]
  - Implemented accessibility tests
- Multiple ES nodes are allowed in configuration

### Not yet in production (futures apps / features)

- [User Dashboard]
  - User can now disconnect from the dashboard
  - HTTP proxy is now supported
  - Issuer URL is now given by the environment instead of static a string
  - Synchronized logs mapping between FC and FC+
  - Limited events sent by the consumer to user login events only
- [Partners Dashboard]
  - Created the front and back applications

## v3.85.0 & v3.86.0

### Hardening & QA

- Fixed linter `tsx` rules that were applied to `ts` files
- [AgentConnect]
  - Implemented visual regression tests
  - SP can now request the IdP `amr` ([Authentication Methods References](https://www.ietf.org/rfc/rfc8176.html))

### Not yet in production (futures apps / features)

- [User Dashboard]
  - A notification email is now sent when the user preferences are edited
  - Added CSRF protection when the user preferences are edited
  - FC low legacy entries are now shown on the user connection log
  - Fixed the "allowFutureIdp" property

## v3.83.0 & v3.84.0

### Features

- [AgentConnect]
  - Research now works with the IdP name and not only the administration name
  - Disconnection from AgentConnect now propagated to the IdP

### Fixes

- [eIDASBridge] Updated the DTO rules to match the european XML schema
- [Changelog v3.82] Added the missing changelog of the previous version

### Hardening & QA

- [ElasticSearch] Added authentication
- [FranceConnect] Configured a dedicated mock user to test the connection history log and to avoid conflicts with other tests)

### Not yet in production (futures apps / features)

- [User Dashboard]
  - The interface to enable / disable an IdP has been implemented
  - Fix database architecture for IdP settings
  - The application does not need anymore the secret to decrypt the IdPs' client secrets
  - The application is now connected to the legacy database instead of FC+ one

## v3.81.0 & v3.82.0

### Features

- [AgentConnect] The error page is now handled by the frontend (REACT) instead of a backend rendering rendering

### Fixes

- [eIDASBridge] Updated the DTO rules to match the european XML schema

### Hardening & QA

- Upgrade NodeJS to 14.19.0
- [FranceConnect] Changed the mock user used to test the user history log (the default (test / 123) one was used and it would later conflict with other tests)

### Not yet in production (futures apps / features)

- [User Dashboard] The user is now able to choose a default behavior (active / inactive) new IDPs joining FC

## v3.79.0 & v3.80.0

🚧 As the team was busy working on legacy code there is sadly nothing to see here 😢 🚧

## v3.77.0 & v3.78.0

### Features

- [AgentConnect] Now the RIE consumer can use a GLOBAL_AGENT_HTTP_PROXY

### Fixes

- [AgentConnect]
  - Rename `build:bridge-http-proxy` yarn command to `build:bridge-http-proxy-rie`
  - Better error handling for `hybridge-http-proxy`

### Hardening & QA

- Upgrade cypress to 9.2.0
- Upgrade NodeJS to 14.18.2
- [AgentConnect] Update integration test data
- [FranceConnect+] Add more accessibility and E2E to test its resilience

### Not yet in production (futures apps / features)

- [User Dashboard] The backend consumer can read and edit user preferences regarding IdPs

## v3.76.1 (🔥 hotfix 🔥)

- Fixed notification mail compatibility with yahoo mailer

## v3.75.0 & v3.76.0 🎉 Happy new year ! 🎉

### Features

- [AgentConnect]
  - A new scope and a new claim `idp_id` are now available for the SP to know which IdP was used by the agent
  - A new scope and a new claim `idp_acr` are now available for the SP to know which acr value was sent by the Idp
  - A new claim `amr` is now available for the SP to know which authentication method was used
  - Change browserlist configuration
- [FranceConnect+] The mailer library use now SMTP instead of API

### Fixes

- [FranceConnect+] Lowering the length constrains of the `nonce` parametter

- [eIDASBridge]
  - The bridge now sends a "KeepAlive" packet to prevent the firewall from severing the connection of the FR Node to the Apache Ignite Cache
  - Remove unused variable `sessionId` to use the one from the session library

## v3.73.0 & v3.74.0 (🎄 No production deployments, deployments are frozen for festivities 🎄)

### Fixes

- [AgentConnect] Some apps / libs names have been changed to better reflect their functions

### Hardening & QA

- The NPM dependencies have been upgraded
- The units tests / linter and prettier of the front-end applications have been added to the CI (internal)
- Visual regressions are now watched through screenshot automatic testing

### Not yet in production (futures apps / features)

- [AgentConnect / Docker dev-stack] Add a Lemon LDAP IdP to the docker dev-stack
- [AgentConnect] Now AgentConnect can do a whole cinematic using rabbitMQ broker to connect to another isolated network

## v3.71.0 & v3.72.0

### Features

- [AgentConnect] Pages are now compliant with the french state design system

### Fixes

- [FranceConnect+] The business logs now track the right ids
- [Docker dev-stack] Fix a configuration that was not correctly mirroring the integration configuration

### Hardening & QA

- Removed express complex objects query and body parsing as it is not used by the project
- Some old redundant E2E tests were removed as the BDD tests gain coverage
- New BDD tests have been added to cover all ACRs that could be sent by the IdPs
- New BDD tests have been added to ensure that all wanted encryption algorithms are configured properly

### Not yet in production (futures apps / features)

- [User Dashboard] Creation of API for partners to get and display the users history
- [User Dashboard] Users can now see the platform name were the event occurred in their history
- [AgentConnect] proxy-bridge app can now proxy requests to the rabbitMQ broker

## v3.69.0 & v3.70.0

- _🎉 Tell the guards to open up the gates !_
  As from today we are going Open Source 🎉.
