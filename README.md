# NodeJS implementation GraphQL
> simple graphql-modules, apollo server setup with modules utilizing GraphQL

- https://github.com/maapteh/graphql-golang
- https://github.com/maapteh/graphql-nodejs

1. `yarn`
2. `yarn dev`

http://localhost:4000/graphql


## Profiling

Run the application `yarn profile:flamegraph`

Static query not calling any async resolvers 
`hey -n 200 -c 80 -cpus 1 -z 10s -m POST --disable-keepalive -H "X-Authorization: foo" -H "Content-Type: application/json" -H 'client-name: readme' -H 'client-version: 1.0.0' -d '{ "query": "{ version }" }' http://localhost:4000/graphql`