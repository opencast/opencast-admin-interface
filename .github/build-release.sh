#!/bin/bash

# Build integrated version
cd ../app
rm -rf build/
export PUBLIC_URL=/admin-ui
CI=false npm run build

FILENAME="oc-admin-ui-$(date -u +%F).tar.gz"
cd build
tar -czf ../$FILENAME *
