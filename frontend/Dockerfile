# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package definitions first to cache dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the frontend source
COPY . .

# Receive VITE_API_URL build parameter
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the project
RUN npm run build

# Stage 2: Serve stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
