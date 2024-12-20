# Use an official Node.js image as the base image
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

#Environment Variables
ENV PORT=4005
ENV REACT_APP_API_BASE_URL="http://172.17.2.128:7002/api/v1"

# Copy the rest of the application files into the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy the build output from the previous stage to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]