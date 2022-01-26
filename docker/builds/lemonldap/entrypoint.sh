#!/usr/env bash

# Désactiver l'écoute en IPv6
sed -i -e '/listen \[::\]:80/d' /etc/lemonldap-ng/*-nginx.conf /etc/nginx/sites-available/*

dumb-init -- /bin/sh /docker-entrypoint.sh
