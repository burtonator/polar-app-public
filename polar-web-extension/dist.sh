#!/bin/bash

DEST=save-to-polar

mkdir -p ${DEST}
cp icon* ${DEST}
cp *.js ${DEST}
cp *.html ${DEST}
cp manifest.json ${DEST}

zip -r save-to-polar.zip save-to-polar
