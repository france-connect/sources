#!/bin/bash

source "./scripts/functions.sh"

tsproject tsproject.json
generate_18n_files "partners apps/core-user-dashboard apps/tracks apps/user-preferences"
generate_18n_files "user-dashboard apps/core-partners"
