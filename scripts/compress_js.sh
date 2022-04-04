#! /bin/bash

JS_PATH=/home/natsume/ballwar/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_src=${JS_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js

