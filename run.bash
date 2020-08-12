#!/bin/bash -e

if [[ $# -ne 0 ]]; then
  echo >&2 "usage: $(basename "$0")"
  exit 1
fi

# do the needful
docker-compose build
docker-compose up --abort-on-container-exit

exit 0
