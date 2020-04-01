#!/usr/bin/env bash

# fetch a specific font by name and store it locally...

# <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

name=${1}

if [ "${name}" = "" ]; then
    echo "syntax $0 name" > /dev/stderr
    exit 1
fi

mkdir -p "${name}"

path="${name}/style.css"

curl -s "https://fonts.googleapis.com/css?family=Open+Sans" \
    -H 'Upgrade-Insecure-Requests: 1' \
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' \
    -H 'DNT: 1' \
    --compressed > "${path}"

# cat ${path} | grep 'src' | grep -Eo 'url(https://[^)]+)'

cat "${path}" | grep 'src:' | grep -Eo 'url\(https://[^)]+\)' | grep -Eo 'https://[^)]+' > /tmp/font-urls.txt

for url in `cat /tmp/font-urls.txt`; do
    filename=$(basename ${url})
    curl ${url} > "${name}/${filename}"
done


