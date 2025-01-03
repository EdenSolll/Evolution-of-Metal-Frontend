# Use an official Node runtime as a parent image
FROM node:alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "run", "dev"]


FROM nginxinc/nginx-unprivileged as serve
WORKDIR /app
COPY --from=build /app/dist /app/
COPY nginx.conf /etc/nginx
EXPOSE 8080
EXPOSE 5173
