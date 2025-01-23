#!/bin/bash

# Pre scripts
# npm update
# pm2 update
# pm2 install typescript

# Set up APIs
modules=(
    "bff"
    # "discord"
    "twitch"
)

for module in ${modules[@]}; do
    cd $module
    pm2 stop "midware_$module"
    pm2 delete "midware_$module"
    pm2 save
    cp ../.env .env
    cp ../tsconfig.json tsconfig.json
    rimraf build && tsc -p tsconfig.json
    pm2 start build/index.js \
        --name "midware_$module" \
        --watch "**/*.js" \
        --log "../logs/$module.log" \
        --time \
        -f
    cd ..
done

# Post scripts
pm2 save
pm2 monit
