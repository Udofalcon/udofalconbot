#!/bin/bash

# Pre scripts
npm update
pm2 update
pm2 install typescript
rm -rf logs
mkdir logs

# Set up APIs
apis=(
    "bff"
    "twitch"
)

for module in ${apis[@]}; do
    cd $module
    pm2 stop "stream_$module"
    pm2 delete "stream_$module"
    pm2 save
    cp ../.env .env
    cp ../tsconfig.json tsconfig.json
    rimraf build && tsc -p tsconfig.json
    pm2 start build/index.js \
        --name "stream_$module" \
        --watch "**/*.js" \
        --log "../logs/$module.log" \
        --time \
        -f
    cd ..
done

# Post scripts
pm2 save
pm2 monit
