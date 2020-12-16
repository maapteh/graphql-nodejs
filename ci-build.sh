#!/usr/bin/env sh

NODE_ENV=development

yarn install --network-timeout 100000

# DURING BUILDS FROM MASTER WE DONT VALIDATE SCHEMA SINCE WE DEPLOY FROM MASTER :)

# ALWAYS MAKE SURE WE CREATE LATEST SCHEMA!!!
yarn ci:schema:create || exit 1

yarn ci:linter || exit 1

yarn test:coverage || exit 1

yarn build || exit 1

# production

mv node_modules node_modules.dev

NODE_ENV=production

yarn --network-timeout 100000 --production
