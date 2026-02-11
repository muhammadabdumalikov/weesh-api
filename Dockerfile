# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /projects

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3003

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
