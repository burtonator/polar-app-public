#!/bin/bash

# ./scripts/find-duplicates.sh ../polar-bookshelf/web/js/


# https://stackoverflow.com/questions/1494178/how-to-define-hash-tables-in-bash

dir=${1}

if [ "${dir}" == "" ]; then

  echo SYNTAX ${0} dir
  exit 1
fi

declare -A index

for file in `find ${dir} -name '*.ts'`; do
  basename=$(basename ${file})
  index[${basename}]=${file}
done

for file in `find src -name '*.ts'`; do
  basename=$(basename ${file})

  existing=${index[${basename}]}

  #echo ${existing}

  if [ "${existing}" != "" ]; then

    src_file=${existing}
    shared_file=${file}

    src_md5=$(md5sum ${src_file})
    shared_md5=$(md5sum ${shared_file})

    if [ "${src_md5}" == "${shared_md5}" ]; then
      echo "EXACT MATCH: ${shared_file} vs ${src_file}"
    else
      echo "POSSIBLE MATCH: ${shared_file} vs ${src_file}"
    fi

  fi

done


###
#
# import (.*) from ['"][^'"]+/Preconditions['"];
#
# import $1 from 'polar-shared/src/Preconditions';
