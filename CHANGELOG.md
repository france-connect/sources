# Changelog

**⚠️ The format of the changelog is not fixed and will probably evolve as we work on the Open Source.**

**🔈 The odd versions are not released into production.**

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
