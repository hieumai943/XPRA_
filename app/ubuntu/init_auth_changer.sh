#!/bin/sh

# Install required packages
apk add --no-cache apache2-utils openssl

# Make sure the change_auth.sh script is executable
chmod +x /change_auth.sh

# Set up the cron job
echo "0 * * * * /change_auth.sh" > /etc/crontabs/root

# Run crond in the foreground
crond -f -d 8