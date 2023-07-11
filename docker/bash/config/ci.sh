#!/usr/bin/env bash

# Disable TTY on CI env
[ $CI ] && NO_TTY=" -T" || NO_TTY=""
