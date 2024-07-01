# Use the official Node.js image
FROM node:18

# Create and set the working directory
WORKDIR /app/frontend

# Copy the rest of the application code
COPY . .

# # Copy package.json and install dependencies
# COPY package*.json ./
RUN npm install

# Build the React app for production
RUN npm run build

# Use nginx to serve the app
FROM nginx:alpine
COPY --from=0 /app/frontend/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
