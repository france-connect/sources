#!/bin/bash

source "./scripts/functions.sh"

tsproject tsproject.json
generate_18n_files "partners"
generate_18n_files "user-dashboard"
