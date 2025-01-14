#!/bin/bash

mw=(
    "bff"
    # "discord"
    "twitch"
)
be=(
    # "logs"
    "db"
)

for module in ${mw[@]}; do
    cd $module
    pm2 stop "midware_$module"
    pm2 delete "midware_$module"
    cd ..
done

for module in ${be[@]}; do
    cd $module
    pm2 stop "backend_$module"
    pm2 delete "backend_$module"
    cd ..
done

# Post scripts
pm2 save