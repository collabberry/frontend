FROM node:20-alpine AS build

# Set up build arguments
ARG VITE_APP_BASE_URL
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

ARG VITE_APP_TEAM_POINTS_FACTORY_ADDRESS
ENV VITE_APP_TEAM_POINTS_FACTORY_ADDRESS=$VITE_APP_TEAM_POINTS_FACTORY_ADDRESS

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install dependencies
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Start a new stage for a smaller final image
FROM node:20-alpine AS final

# Set working directory
WORKDIR /app

# Install serve to run the application
RUN apk add --no-cache python3 make g++
RUN npm install -g serve

# Copy the built assets from the build stage
COPY --from=build /app/build ./dist

# Set the command to serve the app
CMD ["serve", "-s", "dist", "-l", "4100"]
