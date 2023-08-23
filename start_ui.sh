#!/bin/bash

# Pre scripts
npm update
cp .env dashboard/.env

# Set up APIs
cd dashboard
npm start

# Post scripts
