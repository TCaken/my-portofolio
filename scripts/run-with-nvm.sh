#!/usr/bin/env bash
# Ensures nvm is loaded and .nvmrc is used before running a command.
# Use so that "npm run test" (and similar) use Node 24 even when the Cursor terminal didn't run .zshrc.
set -e
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  if [ -f .nvmrc ]; then
    nvm use
  fi
fi
exec "$@"
