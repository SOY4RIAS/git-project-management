#!/bin/bash
npm i

bash ./scripts/generate-key.sh

npx pm2 delete GitProjectManagement 

npm run start
