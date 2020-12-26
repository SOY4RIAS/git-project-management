#!/bin/bash
cp .env.example .env

function generatePassword {
  openssl rand -hex 16
}


echo "MAKING THE SEED TOKEN ..."

ACCESS_KEY=$(generatePassword)

if [[ -z "$PORT_DELEGATE" ]]; then

  sed -i.bak \
  -e "s#SEED_TOKEN=.*#SEED_TOKEN=${ACCESS_KEY}#g" \
  "./.env"
 
else

  echo "Setting Custom PORT $PORT_DELEGATE"

  sed -i.bak \
  -e "s#SEED_TOKEN=.*#SEED_TOKEN=${ACCESS_KEY}#g" \
  -e "s#APP_PORT=.*#APP_PORT=${PORT_DELEGATE}#g" \
  "./.env"

  unset PORT_DELEGATE
fi

rm .env.bak

tput setaf 2
echo "THE SEED TOKEN WAS SAVED ON './.env'..."

