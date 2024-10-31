# Use the official Node.js v21 image (current version you're using)
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies with --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port (Vite's default is 5173)
EXPOSE 5173

# Run the app in development mode
CMD ["npm", "run", "dev", "--", "--host"]
