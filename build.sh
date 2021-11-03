#!/bin/bash
set -e

# sourc directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC=$DIR/src

# Make sure src exists
mkdir -p $SRC

# change dir
cd $DIR/deps/optipng

# start configuring
LDFLAGS="-s TOTAL_MEMORY=256MB --pre-js ../../../../pre.js --post-js ../../../../post.js -flto" CFLAGS="-O3 -flto" emconfigure ./configure

# Make it.
emmake make -j

cd $DIR/deps/optipng/src/optipng

# move to src.
mv optipng $SRC/optipng.js
mv optipng.wasm $SRC/optipng.wasm

echo "Successfully compiled optipng to javascript! Try to check $SRC"
