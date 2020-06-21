#!/bin/bash

DEST=dist

mkdir -p ${DEST}
cp assets/* ${DEST}
cp src/*.html ${DEST}
cp manifest.json ${DEST}

zip -r polar-web-extension.zip dist
