#!/bin/bash

DEST=dist

set -e

mkdir -p ${DEST}
cp assets/* ${DEST}
cp src/*.html ${DEST}
cp manifest.json ${DEST}

./bin/generate-manifest.js

(cd dist && zip -r ../polar-web-extension.zip .)
