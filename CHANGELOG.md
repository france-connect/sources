# Changelog

**⚠️ The format of the changelog is not fixed and will probably evolve as we work on the Open Source.**

**🔈 The odd versions are not released into production.**

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
