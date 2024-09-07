# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the .htpasswd file to the container for basic authentication
COPY .htpasswd /etc/nginx/.htpasswd

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]