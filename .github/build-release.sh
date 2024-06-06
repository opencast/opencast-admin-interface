#!/bin/bash

set -eux

# Build integrated version
cd ..
rm -rf build/
export PUBLIC_URL=/admin-ui
npm run build

FILENAME="oc-admin-ui-$(date -u +%F).tar.gz"
cd build
tar -czf "../${FILENAME}" *
