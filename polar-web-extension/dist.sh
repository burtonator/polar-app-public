#!/bin/bash

DEST=dist
ZIP=../polar-web-extension.zip

set -e

mkdir -p ${DEST}
cp assets/* ${DEST}
cp src/*.html ${DEST}
cp manifest.json ${DEST}

./bin/generate-manifest.js

(cd dist && zip -r ${ZIP} .)

echo wrote ${ZIP}
