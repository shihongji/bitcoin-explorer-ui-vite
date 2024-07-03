# Build stage
FROM node:20 as build

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Use ARG to accept the API_URL during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build your app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
