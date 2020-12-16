#!/usr/bin/env sh

export NODE_ENV=development

yarn --network-timeout 100000

# ALWAYS MAKE SURE WE CREATE LATEST SCHEMA!!!
yarn ci:schema:create || exit 1

# no breaking changes, most important step during PR we keep our contracts working
yarn ci:schema:diff || exit 1

# is schema according to our rules
yarn ci:linter || exit 1

# can we build the application
yarn ci:types:compile || exit 1

# do all tests still work?
yarn test || exit 1

yarn build || exit 1

yarn ci:changelog || exit 1

mv node_modules node_modules.dev

# fetch production dependencies
export NODE_ENV=development

yarn --network-timeout 100000
