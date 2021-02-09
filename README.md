# NodeJS implementation GraphQL
> simple graphql-modules, apollo server setup with modules utilizing GraphQL

- https://github.com/maapteh/graphql-golang
- https://github.com/maapteh/graphql-nodejs

1. `yarn`
2. `yarn dev`

http://localhost:4000/graphql


## Setup
We are testing three NodeJS versions

- `src/apollo.ts` Apollo with simple typeDefs and resolvers merged, with graphql-jit executor
- `src/index.ts` Apollo setup with the graphql-modules, with graphql-jit executor
- `src/helix.ts` Helix standard

## Profiling

Two profile dist apps:

1. `yarn profile:flamegraph` 0x flamegraph
2. `yarn profile:clinic` clinic doctor

### Example for Static query, not calling any async resolvers 

[hey](https://github.com/rakyll/hey): now put some load on it for 10 seconds

`hey -n 200 -c 80 -cpus 1 -z 10s -m POST --disable-keepalive -H "client-name: readme" -H "client-version: 1.0.0" -H "X-Authorization: foo" -H "Content-Type: application/json" -H 'client-name: readme' -H 'client-version: 1.0.0' -d '{ "query": "{ version }" }' http://localhost:4000/graphql`


## Curl
Test if application works from commandline:

```
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H 'client-name: readme' \
  -H 'client-version: 1.0.0' \
  -H "X-Authorization: FOO.BAR" \
  --data '{ "query": "{ version }" }' \
  http://localhost:4000/graphql
```