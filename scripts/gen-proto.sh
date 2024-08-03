#!/bin/bash

rm -rf src/gen
mkdir -p src/gen

protoc --plugin=$(npm root)/.bin/protoc-gen-ts_proto \
 --ts_proto_out=src/gen \
 --ts_proto_opt=outputServices=grpc-js \
 --ts_proto_opt=esModuleInterop=true \
 -I=src/ src/**/*.proto
