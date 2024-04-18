#!/bin/bash

# ------------------------
#
# Description
# ---
# Cleanup de toutes les dependances des sous projets
# Les sous projets sont definis dans ./package.json { workspaces: [...] }
#
# Usage
# ---
# $ yarn cleanup
#
# ------------------------

echo "Cleanup project dependencies"

echo "Removing node_modules"
find . -maxdepth 3 -type d -name node_modules | xargs -i rm -rf {}

echo "Removing package manager generated files"
find . -maxdepth 3 -type f -regextype posix-extended -iregex '.*(yarn-error.log|package-lock.json)' | xargs -i rm {}

echo "Removing tsconfig.json files generated with tsproject"
find . -maxdepth 1 -type f -regextype posix-extended -iregex '.*/tsconfig\..+' | xargs -i rm {}

echo "Removing instances build folder"
find ./instances -maxdepth 1 -type d -name build | xargs -i rm -rf {}
