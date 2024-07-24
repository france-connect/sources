# Device

Handles a set of features related to device qualifications.

## Identity Hashes, Trust and Share

This exposes functions to keep track of unique identities used on a device by storing hashes in a dedicated cookie.

This allows detection of whether the device was already used for a given identity and the number of unique identities used on the device.  
This information is stored in a dedicated session part called `Device`.  
It is then possible to retrieve this information and adapt application behavior accordingly.

For example, sending or not sending a connection notification, asking for a TOTP, etc.

### A note on privacy

For optimal privacy, the hashes are "salted" by both a dedicated backend secret and a device-specific secret (also stored in the cookie).
This prevents hash comparison between devices.

Hashes have an individual lifetime (configurable).

The identity properties used to create the hash are also configurable.

See [configuration DTO](./src/dto/device-config.dto.ts) for all configuration options.

## Headers Flags

This library also handles flags set through headers, typically by a Web Application Firewall (WAF) or a Reverse Proxy (RP).

For now, the only flag supported is `x-suspicious`, although more could be added in the future to allow the application to adapt its behavior.  
Header names and values are configurable to limit the coupling between the application and WAF or RP.

## Usage

The [Device service](./src/services/device.service.ts) exposes only two methods: `initSession()` and `update()`.

### initSession()

This is the minimum needed to use le library.
It will retrieve the current device information and store information in session.

### update()

This method allows appending an identity to the device cookie.  
It must be called to use the identity hashes-related features.

:bulb: `update()` returns a lot of information regarding the state of the device, some of whom can not be retrieved afterward, regarding the changes operated:

- `becameTrusted` _(boolean)_: Did the device become `trusted` because of this update?
- `becameShared` _(boolean)_: Did the device become `shared` because of this update?
- `newIdentity` _(boolean)_: Is it a new identity hash for this device?

## Evolutions

For now, the library exposes a limited amount of information in session, according to the current needs.

The list of stored properties could be expanded or even made configurable (as we do for the `templateExposed` config in `@fc/session` or `@fc/config`).

We could expose a method to retrieve device information outside of a call to `update()`, and thus hide the coupling with `@fc/session`. (This is not needed for now)
