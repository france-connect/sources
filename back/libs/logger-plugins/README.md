# logger plugins

A set of common plugins to add context for @fc/logger

## Request plugin

Adds

- method (HTTP)
- path
- requestId (header)
- ip
- ForwardedFor (header)

## Session plugin

Adds

- sessionId
- browsingSessionId

## debug plugin

Adds

- callStack
- methodName
