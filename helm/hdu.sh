#!/bin/sh
# Name of the file translates to `helm dependency update`
# run chmod 755 hdu.sh
# run this script from ./charts directory

GREEN='\033[0;32m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo "${PURPLE}Updating $i...${NC}"
helm dependency update ./$i
echo "${PURPLE}Finished $i${NC}"

echo "${GREEN}Dependencies were updated${NC}"