# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /bookbee-backend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app's code
COPY . .

# Build the app
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
