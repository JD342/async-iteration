#!/bin/bash
NPM_BIN=`npm bin`
SCRIPTS_DIR=`dirname $0`

"$NPM_BIN/if-node-version" ">=7" \
    node --harmony "$SCRIPTS_DIR/$1" &&\
"$NPM_BIN/if-node-version" "<7" \
    "$NPM_BIN"/babel-node --presets es2015,es2016,es2017 "$SCRIPTS_DIR/$1"

exit $?
