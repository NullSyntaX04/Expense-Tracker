# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Default command
CMD ["npm", "start"]
