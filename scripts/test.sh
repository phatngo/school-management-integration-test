#!/bin/bash

source .env
while [[ $# -gt 0 ]]
do
key="$1"
case $key in
    --tags)
        TAGS="$2"
        shift # past argument=value
        shift
    ;;
    *)
        echo "usage:
        --tags          Scenario tags"
        exit 1
    ;;
esac
done

if [[ ${TAGS} ]]; then
    node_modules/.bin/cucumber-js -p default -t "${TAGS}"
else
    node_modules/.bin/cucumber-js -p default
fi