FROM nginx:alpine

# Copy app files to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx runs automatically
CMD ["nginx", "-g", "daemon off;"]
