#!/bin/sh

apt update && apt list --upgradable && apt upgrade -y

npm i -g nodemon node-gyp

npm i --only=prod && npm cache clean --force

npm start
