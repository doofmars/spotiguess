#!/bin/bash

yarn build
yarn audit --groups "dependencies"
scp -r build/ spotiguess:spotiguess/dev
